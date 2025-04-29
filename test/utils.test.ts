import { describe, expect, test, vi } from "vitest"

import { getChangelogEntry, getOptionalInput, setupOctokit } from "../src/utils"
import { changelog, major, minor, patch } from "./content"

describe("utils", () => {
  const mock = vi.hoisted(() => ({
    fetch: vi.fn(),
    getInput: vi.fn(),
    getOctokitOptions: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  }))

  vi.mock("@actions/core", async (actual) => ({
    ...(await actual<typeof import("@actions/core")>()),
    getInput: mock.getInput,
    info: mock.info,
    warning: mock.warning,
  }))

  vi.mock("@actions/github/lib/utils", async (actual) => ({
    ...(await actual<typeof import("@actions/github/lib/utils")>()),
    getOctokitOptions: mock.getOctokitOptions,
  }))

  describe("getChangelogEntry", () => {
    test("Extract specific patch version content correctly", () => {
      const version = "1.2.2"
      const { content, highestLevel } = getChangelogEntry(changelog, version)

      expect(content).toBe(patch)
      expect(highestLevel).toBe(1)
    })

    test("Extract specific minor version content correctly", () => {
      const version = "2.10.0"
      const { content, highestLevel } = getChangelogEntry(changelog, version)

      expect(content).toBe(minor)
      expect(highestLevel).toBe(2)
    })

    test("Extract specific major version content correctly", () => {
      const version = "2.0.0"
      const { content, highestLevel } = getChangelogEntry(changelog, version)

      expect(content).toBe(major)
      expect(highestLevel).toBe(3)
    })
  })

  describe("getOptionalInput", () => {
    test("Works correctly when exist value", () => {
      mock.getInput.mockReturnValue("Input exist")

      const value = getOptionalInput("input")

      expect(value).toBe("Input exist")
    })

    test("Works correctly when does not exist value", () => {
      mock.getInput.mockReturnValue("")

      const value = getOptionalInput("input")

      expect(value).toBeUndefined()
    })
  })

  describe("setupOctokit", () => {
    const content = {
      body: "This is test of create github release",
      owner: "108yen",
      repo: "changeset-release",
      tag_name: "v1.0.0",
      target_commitish: "xxx",
    } as const

    test("Request called correctly", async () => {
      const mockFetch = vi.fn()

      mock.getOctokitOptions.mockImplementation((token, opts) => ({
        ...opts,
        request: { fetch: mockFetch },
        token,
      }))

      mockFetch.mockResolvedValue(
        new Response(JSON.stringify({}), { status: 201 }),
      )

      const octokit = setupOctokit("token")

      await octokit.rest.repos.createRelease(content)

      expect(mockFetch).toHaveBeenCalledExactlyOnceWith(
        `https://api.github.com/repos/${content.owner}/${content.repo}/releases`,
        expect.objectContaining({
          body: JSON.stringify({
            body: content.body,
            tag_name: content.tag_name,
            target_commitish: content.target_commitish,
          }),
        }),
      )
    })

    describe("Rate limit", () => {
      test("Works correctly when github api rate limit", async () => {
        const mockFetch = vi.fn()

        mock.getOctokitOptions.mockImplementation((token, opts) => ({
          ...opts,
          request: { fetch: mockFetch },
          token,
        }))

        const headers = new Headers({
          "Retry-After": "60",
          "X-RateLimit-Limit": "60",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": "1714138800",
        })
        const body = {
          documentation_url:
            "https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting",
          message: "API rate limit exceeded for xxx.xxx.xxx.xxx.",
        }

        mockFetch
          .mockResolvedValueOnce(
            new Response(JSON.stringify(body), { headers, status: 429 }),
          )
          .mockResolvedValue(new Response(JSON.stringify({}), { status: 201 }))

        const octokit = setupOctokit("token")

        await octokit.rest.repos.createRelease(content)

        expect(mockFetch).toBeCalledTimes(2)
        expect(mockFetch).toBeCalledWith(
          `https://api.github.com/repos/${content.owner}/${content.repo}/releases`,
          expect.objectContaining({
            body: JSON.stringify({
              body: content.body,
              tag_name: content.tag_name,
              target_commitish: content.target_commitish,
            }),
          }),
        )

        expect(mock.info).toBeCalledWith("Retrying after 0 seconds!")
        expect(mock.warning).toBeCalledWith(
          "Request quota exhausted for request POST /repos/{owner}/{repo}/releases",
        )
      })

      test("Error when github api rate limit 3 times", async () => {
        const mockFetch = vi.fn()

        mock.getOctokitOptions.mockImplementation((token, opts) => ({
          ...opts,
          request: { fetch: mockFetch },
          token,
        }))

        const headers = new Headers({
          "Retry-After": "60",
          "X-RateLimit-Limit": "60",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": "1714138800",
        })
        const body = {
          documentation_url:
            "https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting",
          message: "API rate limit exceeded for xxx.xxx.xxx.xxx.",
        }

        mockFetch.mockImplementation(
          async () =>
            new Response(JSON.stringify(body), { headers, status: 429 }),
        )

        const octokit = setupOctokit("token")

        await expect(() =>
          octokit.rest.repos.createRelease(content),
        ).rejects.toThrowError(JSON.stringify(body))

        expect(mockFetch).toBeCalledTimes(4)
        expect(mockFetch).toBeCalledWith(
          `https://api.github.com/repos/${content.owner}/${content.repo}/releases`,
          expect.objectContaining({
            body: JSON.stringify({
              body: content.body,
              tag_name: content.tag_name,
              target_commitish: content.target_commitish,
            }),
          }),
        )

        expect(mock.info).toBeCalledTimes(3)
        expect(mock.info).toBeCalledWith("Retrying after 0 seconds!")
        expect(mock.warning).toBeCalledTimes(4)
        expect(mock.warning).toBeCalledWith(
          "Request quota exhausted for request POST /repos/{owner}/{repo}/releases",
        )
      })

      test("Works correctly when github api secondary rate limit", async () => {
        const mockFetch = vi.fn()

        mock.getOctokitOptions.mockImplementation((token, opts) => ({
          ...opts,
          request: { fetch: mockFetch },
          token,
        }))

        const headers = new Headers({
          "Retry-After": "1",
          "X-RateLimit-Limit": "60",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": "1714138800",
        })
        const body = {
          documentation_url:
            "https://docs.github.com/rest/overview/resources-in-the-rest-api#secondary-rate-limits",
          message:
            "You have exceeded a secondary rate limit and have been temporarily blocked from content creation. Please retry your request again later.",
        }

        mockFetch
          .mockResolvedValueOnce(
            new Response(JSON.stringify(body), { headers, status: 429 }),
          )
          .mockResolvedValue(new Response(JSON.stringify({}), { status: 201 }))

        const octokit = setupOctokit("token")

        await octokit.rest.repos.createRelease(content)

        expect(mockFetch).toBeCalledTimes(2)
        expect(mockFetch).toBeCalledWith(
          `https://api.github.com/repos/${content.owner}/${content.repo}/releases`,
          expect.objectContaining({
            body: JSON.stringify({
              body: content.body,
              tag_name: content.tag_name,
              target_commitish: content.target_commitish,
            }),
          }),
        )

        expect(mock.info).toBeCalledWith("Retrying after 1 seconds!")
        expect(mock.warning).toBeCalledWith(
          "SecondaryRateLimit detected for request POST /repos/{owner}/{repo}/releases",
        )
      })

      test("Error when github api secondary rate limit 3 times", async () => {
        const mockFetch = vi.fn()

        mock.getOctokitOptions.mockImplementation((token, opts) => ({
          ...opts,
          request: { fetch: mockFetch },
          token,
        }))

        const headers = new Headers({
          "Retry-After": "1",
          "X-RateLimit-Limit": "60",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": "1714138800",
        })
        const body = {
          documentation_url:
            "https://docs.github.com/rest/overview/resources-in-the-rest-api#secondary-rate-limits",
          message:
            "You have exceeded a secondary rate limit and have been temporarily blocked from content creation. Please retry your request again later.",
        }

        mockFetch.mockImplementation(
          async () =>
            new Response(JSON.stringify(body), { headers, status: 429 }),
        )

        const octokit = setupOctokit("token")

        await expect(() =>
          octokit.rest.repos.createRelease(content),
        ).rejects.toThrowError(JSON.stringify(body))

        expect(mockFetch).toBeCalledTimes(4)
        expect(mockFetch).toBeCalledWith(
          `https://api.github.com/repos/${content.owner}/${content.repo}/releases`,
          expect.objectContaining({
            body: JSON.stringify({
              body: content.body,
              tag_name: content.tag_name,
              target_commitish: content.target_commitish,
            }),
          }),
        )

        expect(mock.info).toBeCalledTimes(3)
        expect(mock.info).toBeCalledWith("Retrying after 1 seconds!")
        expect(mock.warning).toBeCalledTimes(4)
        expect(mock.warning).toBeCalledWith(
          "SecondaryRateLimit detected for request POST /repos/{owner}/{repo}/releases",
        )
      })
    })
  })
})
