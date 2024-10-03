import * as core from "@actions/core"
import * as github from "@actions/github"
import { getOctokitOptions, GitHub } from "@actions/github/lib/utils"
import { throttling } from "@octokit/plugin-throttling"
import { findPackages } from "find-packages"
import fs from "fs"

import { getChangelogEntry } from "./utils"

const setupOctokit = (githubToken: string) => {
  return new (GitHub.plugin(throttling))(
    getOctokitOptions(githubToken, {
      throttle: {
        onRateLimit: (retryAfter, options: any, octokit, retryCount) => {
          core.warning(
            `Request quota exhausted for request ${options.method} ${options.url}`,
          )

          if (retryCount <= 2) {
            core.info(`Retrying after ${retryAfter} seconds!`)
            return true
          }
        },
        onSecondaryRateLimit: (
          retryAfter,
          options: any,
          octokit,
          retryCount,
        ) => {
          core.warning(
            `SecondaryRateLimit detected for request ${options.method} ${options.url}`,
          )

          if (retryCount <= 2) {
            core.info(`Retrying after ${retryAfter} seconds!`)
            return true
          }
        },
      },
    }),
  )
}

async function main() {
  try {
    const githubToken = process.env.GITHUB_TOKEN

    if (!githubToken) {
      core.setFailed("Please add the GITHUB_TOKEN to the changesets action")
      return
    }

    const octokit = setupOctokit(githubToken)

    const packages = await findPackages("./")
    const { name, version } = packages[0].manifest

    if (!version || !name) {
      core.setFailed(
        "Please add name and version to package.json in the root folder.",
      )
      return
    }

    const changelog = fs.readFileSync("CHANGELOG.md", "utf-8")

    const tagName = `${name}@${version}`
    const { content } = getChangelogEntry(changelog, version)

    await octokit.rest.repos.createRelease({
      body: content,
      name: tagName,
      tag_name: tagName,
      ...github.context.repo,
    })
  } catch {
    core.setFailed("Unexpected error, something wrong.")
  }
}

main()
