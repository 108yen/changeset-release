import * as core from "@actions/core"
import { toString } from "mdast-util-to-string"
import remarkParse from "remark-parse"
import remarkStringify from "remark-stringify"
import { unified } from "unified"

export const BumpLevels = {
  dep: 0,
  major: 3,
  minor: 2,
  patch: 1,
} as const

export function getChangelogEntry(changelog: string, version: string) {
  const ast = unified().use(remarkParse).parse(changelog)

  let highestLevel: number = BumpLevels.dep

  const nodes = ast.children as Array<any>
  let headingStartInfo:
    | {
        depth: number
        index: number
      }
    | undefined
  let endIndex: number | undefined

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (node.type === "heading") {
      const stringified: string = toString(node)
      const match = stringified.toLowerCase().match(/(major|minor|patch)/)
      if (match !== null) {
        const level = BumpLevels[match[0] as "major" | "minor" | "patch"]
        highestLevel = Math.max(level, highestLevel)
      }
      if (headingStartInfo === undefined && stringified === version) {
        headingStartInfo = {
          depth: node.depth,
          index: i,
        }
        continue
      }
      if (
        endIndex === undefined &&
        headingStartInfo !== undefined &&
        headingStartInfo.depth === node.depth
      ) {
        endIndex = i
        break
      }
    }
  }
  if (headingStartInfo) {
    ast.children = (ast.children as any).slice(
      headingStartInfo.index + 1,
      endIndex,
    )
  }
  return {
    content: unified().use(remarkStringify).stringify(ast),
    highestLevel: highestLevel,
  }
}

export function getOptionalInput(name: string) {
  return core.getInput(name) || undefined
}