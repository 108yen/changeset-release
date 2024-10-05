import * as core from "@actions/core"
import * as github from "@actions/github"
import { getOctokitOptions, GitHub } from "@actions/github/lib/utils"
import { throttling } from "@octokit/plugin-throttling"
import { findPackages } from "find-packages"
import fs from "fs"

import { getChangelogEntry, getOptionalInput } from "./utils"

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

    const format = getOptionalInput("format") ?? "prefix"

    const packages = await findPackages("./")
    const { name, version } = packages[0].manifest

    if (!name && format == "full") {
      core.setFailed(
        "Could not find name in package.json. Please make sure the name is listed in package.json in the root folder.",
      )
      return
    }

    if (!version) {
      core.setFailed(
        "Could not find version in package.json. Please make sure the version is listed in package.json in the root folder.",
      )
      return
    }

    const octokit = setupOctokit(githubToken)
    const changelog = fs.readFileSync("CHANGELOG.md", "utf-8")

    const { content } = getChangelogEntry(changelog, version)

    let tagName: string

    switch (format) {
      case "full":
        tagName = `${name}@${version}`
        break

      case "major":
        tagName = `v${version.split(".")[0]}`
        break

      case "prefix":
        tagName = `v${version}`
        break

      case "simple":
        tagName = version
        break

      default:
        core.setFailed("Format is wrong.")
        return
    }

    const target = getOptionalInput("target")

    try {
      await octokit.rest.repos.createRelease({
        body: content,
        name: tagName,
        tag_name: tagName,
        target_commitish: target,
        ...github.context.repo,
      })
    } catch (error) {
      core.error(error as string)
      core.setFailed("Failed create release.")
    }

    core.setOutput("tag", tagName)
  } catch (error) {
    core.error(error as string)
    core.setFailed("Unexpected error, something wrong.")
  }
}

main()
