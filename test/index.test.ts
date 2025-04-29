import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { changelog, major } from "./content"
import { main } from "../src/index"

describe("index", () => {
  const mock = vi.hoisted(() => ({
    getOctokitOptions: vi.fn(),
    context: {
      repo: {
        owner: "108yen",
        repo: "changeset-release",
      },
    },
    getInput: vi.fn(),
    fetch: vi.fn(),
    findPackages: vi.fn(),
    readFileSync: vi.fn(),
    setFailed: vi.fn(),
  }))

  vi.mock("@actions/core", async (actual) => ({
    ...(await actual<typeof import("@actions/core")>()),
    getInput: mock.getInput,
    setFailed: mock.setFailed,
  }))

  vi.mock("@actions/github", async (actual) => ({
    ...(await actual<typeof import("@actions/github")>()),
    context: mock.context,
  }))

  vi.mock("@actions/github/lib/utils", async (actual) => ({
    ...(await actual<typeof import("@actions/github/lib/utils")>()),
    getOctokitOptions: mock.getOctokitOptions,
  }))

  vi.mock("find-packages", async (actual) => ({
    ...(await actual<typeof import("find-packages")>()),
    findPackages: mock.findPackages,
  }))

  vi.mock("fs", async (actual) => ({
    ...(await actual<typeof import("fs")>()),
    default: {
      readFileSync: mock.readFileSync,
    },
  }))

  beforeEach(() => {
    mock.findPackages.mockReturnValue([
      {
        manifest: {
          name: "changeset-release",
          version: "2.0.0",
        },
      },
    ])

    mock.getOctokitOptions.mockImplementation((token, opts) => ({
      ...opts,
      request: { fetch: mock.fetch },
      token,
    }))

    mock.fetch.mockResolvedValue(
      new Response(JSON.stringify({}), { status: 201 }),
    )

    mock.readFileSync.mockReturnValue(changelog)
  })

  afterEach(() => {
    delete process.env.GITHUB_TOKEN
  })

  describe("Call request correctly", () => {
    test("Default format is prefix", async () => {
      mock.getInput.mockImplementation((value) => {
        if (value == "github_token") return "token"
      })

      await main()

      const body = JSON.stringify({
        body: major,
        name: "v2.0.0",
        tag_name: "v2.0.0",
      })

      expect(mock.fetch).toBeCalledWith(
        "https://api.github.com/repos/108yen/changeset-release/releases",
        expect.objectContaining({
          body,
          method: "POST",
        }),
      )
    })

    test.each([
      { format: "full", tag: "changeset-release@2.0.0" },
      { format: "major", tag: "v2" },
      { format: "simple", tag: "2.0.0" },
      { format: "prefix", tag: "v2.0.0" },
    ])("`$format` format", async ({ format, tag }) => {
      mock.getInput.mockImplementation((value) => {
        if (value == "github_token") return "token"
        if (value == "format") return format
      })

      await main()

      const body = JSON.stringify({
        body: major,
        name: tag,
        tag_name: tag,
      })

      expect(mock.fetch).toBeCalledWith(
        "https://api.github.com/repos/108yen/changeset-release/releases",
        expect.objectContaining({
          body,
          method: "POST",
        }),
      )
    })
  })

  describe("Input handling works correctly", () => {
    test("Use `github_token` when passed as env", async () => {
      mock.getInput.mockImplementation((value) => {
        if (value == "github_token") return "token"
      })

      process.env.GITHUB_TOKEN = "another_token"

      await main()

      expect(mock.getOctokitOptions).toBeCalledWith(
        "another_token",
        expect.any(Object),
      )
    })

    test("Error with no github token", async () => {
      await main()

      expect(mock.setFailed).toBeCalledWith(
        "Please add the GITHUB_TOKEN to the changesets action",
      )
      expect(mock.fetch).not.toBeCalled()
    })

    test("Unexpected format", async () => {
      mock.getInput.mockImplementation((value) => {
        if (value == "github_token") return "token"
        if (value == "format") return "complex"
      })

      await main()

      expect(mock.setFailed).toBeCalledWith("Format is wrong.")
      expect(mock.fetch).not.toBeCalled()
    })
  })

  describe("Read `package.json`", () => {
    test("Error with undefined `name` in `full` format", async () => {
      mock.getInput.mockImplementation((value) => {
        if (value == "github_token") return "token"
        if (value == "format") return "full"
      })

      mock.findPackages.mockReturnValue([
        {
          manifest: {
            version: "2.0.0",
          },
        },
      ])

      await main()

      expect(mock.setFailed).toBeCalledWith(
        "Could not find name in package.json. Please make sure the name is listed in package.json in the root folder.",
      )
      expect(mock.fetch).not.toBeCalled()
    })

    test("Error when `version` can not find", async () => {
      mock.getInput.mockImplementation((value) => {
        if (value == "github_token") return "token"
      })

      mock.findPackages.mockReturnValue([
        {
          manifest: {
            name: "changeset-release",
          },
        },
      ])

      await main()

      expect(mock.setFailed).toBeCalledWith(
        "Could not find version in package.json. Please make sure the version is listed in package.json in the root folder.",
      )
      expect(mock.fetch).not.toBeCalled()
    })

    test.todo("Error when content can not find")
  })
})
