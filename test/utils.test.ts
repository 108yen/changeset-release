import { describe, expect, test, vi } from "vitest"

import { getChangelogEntry, setupOctokit } from "../src/utils"

describe("utils", () => {
  describe("getChangelogEntry", () => {
    const changelog = `
# changeset-release

## 2.10.0

### Minor Changes

- [#476](https://github.com/108yen/twitch-clip/pull/476) [\`8aea174\`](https://github.com/108yen/twitch-clip/commit/8aea1746fb93d5a124479d6f9453975d0adc3405) Thanks [@108yen](https://github.com/108yen)! - Added team tags.

### Patch Changes

- [#474](https://github.com/108yen/twitch-clip/pull/474) [\`2c324d0\`](https://github.com/108yen/twitch-clip/commit/2c324d012924c3cd5c0bb34e0034b3bbaabfb5d9) Thanks [@108yen](https://github.com/108yen)! - Updated metadata in streamer page.

- [#476](https://github.com/108yen/twitch-clip/pull/476) [\`548be7d\`](https://github.com/108yen/twitch-clip/commit/548be7d26f5ecc6d7322a560a7637ce8a7dbeb90) Thanks [@108yen](https://github.com/108yen)! - Add titles to each page.

## 2.0.0

### Major Changes

- [#209](https://github.com/108yen/twitch-clip/pull/209) [\`5a9885b\`](https://github.com/108yen/twitch-clip/commit/5a9885bd1c3a0bc69b546f475ce70a6d5cff540d) Thanks [@108yen](https://github.com/108yen)! - Replaced UI library.

### Minor Changes

- [#476](https://github.com/108yen/twitch-clip/pull/476) [\`8aea174\`](https://github.com/108yen/twitch-clip/commit/8aea1746fb93d5a124479d6f9453975d0adc3405) Thanks [@108yen](https://github.com/108yen)! - Added team tags.

### Patch Changes

- [#212](https://github.com/108yen/twitch-clip/pull/212) [\`d21209c\`](https://github.com/108yen/twitch-clip/commit/d21209c7cf850ca31a4410aa03c9b1c60e3ae7fa) Thanks [@108yen](https://github.com/108yen)! - Update scrollbar styles.

- [#210](https://github.com/108yen/twitch-clip/pull/210) [\`9c62a04\`](https://github.com/108yen/twitch-clip/commit/9c62a047a90f3ec3d8fa2198e4a5d42cc40c7952) Thanks [@108yen](https://github.com/108yen)! - Added feature of scroll to top when period tab changed in mobile view.

## 1.2.3

### Patch Changes

- [#52](https://github.com/108yen/changeset-release/pull/52) [\`19f57f3\`](https://github.com/108yen/changeset-release/commit/19f57f3c95c19248693a946dfa20f898762d950f) Thanks [@108yen](https://github.com/108yen)! - Fixed release workflow. Generate tag force.

## 1.2.2

### Patch Changes

- [#50](https://github.com/108yen/changeset-release/pull/50) [\`e665d03\`](https://github.com/108yen/changeset-release/commit/e665d03f6fd7b2f13338e94573a69308dd10352c) Thanks [@108yen](https://github.com/108yen)! - Fixed release workflow failed. We need to setup git config to run update tags script.

## 1.2.1

### Patch Changes

- [#48](https://github.com/108yen/changeset-release/pull/48) [\`b24ace7\`](https://github.com/108yen/changeset-release/commit/b24ace7c080f17f3e3b677121ba5e3d73f710f33) Thanks [@108yen](https://github.com/108yen)! - Update build command to generate licenses, source map.
    `

    test("Extract specific patch version content correctly", () => {
      const version = "1.2.2"
      const { content, highestLevel } = getChangelogEntry(changelog, version)

      expect(content).toBe(
        "### Patch Changes\n\n* [#50](https://github.com/108yen/changeset-release/pull/50) [\`e665d03\`](https://github.com/108yen/changeset-release/commit/e665d03f6fd7b2f13338e94573a69308dd10352c) Thanks [@108yen](https://github.com/108yen)! - Fixed release workflow failed. We need to setup git config to run update tags script.\n",
      )
      expect(highestLevel).toBe(1)
    })

    test("Extract specific minor version content correctly", () => {
      const version = "2.10.0"
      const { content, highestLevel } = getChangelogEntry(changelog, version)

      expect(content).toBe(
        "### Minor Changes\n\n* [#476](https://github.com/108yen/twitch-clip/pull/476) [\`8aea174\`](https://github.com/108yen/twitch-clip/commit/8aea1746fb93d5a124479d6f9453975d0adc3405) Thanks [@108yen](https://github.com/108yen)! - Added team tags.\n\n### Patch Changes\n\n* [#474](https://github.com/108yen/twitch-clip/pull/474) [\`2c324d0\`](https://github.com/108yen/twitch-clip/commit/2c324d012924c3cd5c0bb34e0034b3bbaabfb5d9) Thanks [@108yen](https://github.com/108yen)! - Updated metadata in streamer page.\n\n* [#476](https://github.com/108yen/twitch-clip/pull/476) [\`548be7d\`](https://github.com/108yen/twitch-clip/commit/548be7d26f5ecc6d7322a560a7637ce8a7dbeb90) Thanks [@108yen](https://github.com/108yen)! - Add titles to each page.\n",
      )
      expect(highestLevel).toBe(2)
    })

    test("Extract specific major version content correctly", () => {
      const version = "2.0.0"
      const { content, highestLevel } = getChangelogEntry(changelog, version)

      expect(content).toBe(
        "### Major Changes\n\n* [#209](https://github.com/108yen/twitch-clip/pull/209) [\`5a9885b\`](https://github.com/108yen/twitch-clip/commit/5a9885bd1c3a0bc69b546f475ce70a6d5cff540d) Thanks [@108yen](https://github.com/108yen)! - Replaced UI library.\n\n### Minor Changes\n\n* [#476](https://github.com/108yen/twitch-clip/pull/476) [\`8aea174\`](https://github.com/108yen/twitch-clip/commit/8aea1746fb93d5a124479d6f9453975d0adc3405) Thanks [@108yen](https://github.com/108yen)! - Added team tags.\n\n### Patch Changes\n\n* [#212](https://github.com/108yen/twitch-clip/pull/212) [\`d21209c\`](https://github.com/108yen/twitch-clip/commit/d21209c7cf850ca31a4410aa03c9b1c60e3ae7fa) Thanks [@108yen](https://github.com/108yen)! - Update scrollbar styles.\n\n* [#210](https://github.com/108yen/twitch-clip/pull/210) [\`9c62a04\`](https://github.com/108yen/twitch-clip/commit/9c62a047a90f3ec3d8fa2198e4a5d42cc40c7952) Thanks [@108yen](https://github.com/108yen)! - Added feature of scroll to top when period tab changed in mobile view.\n",
      )
      expect(highestLevel).toBe(3)
    })
  })

  describe.todo("getOptionalInput")

  describe.skip("setupOctokit", () => {
    const content = {
      body: "This is test of create github release",
      owner: "108yen",
      repo: "changeset-release",
      tag_name: "v1.0.0",
      target_commitish: "xxx",
    } as const

    const mock = vi.hoisted(() => ({
      fetch: vi.fn(),
      getOctokitOptions: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
    }))

    vi.mock("@actions/core", async (actual) => ({
      ...(await actual<typeof import("@actions/core")>()),
      info: mock.info,
      warning: mock.warning,
    }))

    vi.mock("@actions/github/lib/utils", async (actual) => ({
      ...(await actual<typeof import("@actions/github/lib/utils")>()),
      getOctokitOptions: mock.getOctokitOptions,
    }))

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
