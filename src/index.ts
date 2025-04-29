import * as core from "@actions/core"
import * as github from "@actions/github"
import { findPackages } from "find-packages"
import fs from "fs"

import { getChangelogEntry, getOptionalInput, setupOctokit } from "./utils"

export async function main() {
  const githubToken =
    process.env.GITHUB_TOKEN ?? getOptionalInput("github_token")

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

  const { content, highestLevel } = getChangelogEntry(changelog, version)

  if (highestLevel == 0) {
    core.setFailed(
      `Could not find changelog of version ${version} in CHANGELOG.md. Please make sure the version is listed in package.json or content in CHANGELOG.md.`,
    )
    return
  }

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
      core.setFailed(
        "Please specify one of the formats.(full, major, prefix, simple)",
      )
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
}

main().catch((error) => {
  core.error(error as string)
  core.setFailed("Unexpected error, something wrong.")
})
