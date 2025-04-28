# 108yen/changeset-release

[![codecov](https://codecov.io/gh/108yen/changeset-release/graph/badge.svg?token=F2CQYGDLHE)](https://codecov.io/gh/108yen/changeset-release)
[![MIT LIcense](https://img.shields.io/github/license/108yen/changeset-release)](https://img.shields.io/github/license/108yen/changeset-release)

This action extracts the process of creating a release to github from [`Changesets Release Action`](https://github.com/changesets/action).
This allows for release whenever you want.

## Usage

### Inputs

- format: Release tag format. Choose one of these. (Default: `prefix`.)
  - full: `package@1.0.0`
  - major: `v1`
  - prefix `v1.0.0`
  - simple `1.0.0`
- target: Specifies the commitish value that determines where the Git tag is created from. Can be any branch or commit SHA. Unused if the Git tag already exists. (Default: the repository's default branch.)

### Outputs

- tag: Release tag. (Example: `v1.0.0`)

### Example workflow

This is an example of a release workflow that works when a PR issued by [`Changesets Release Action`](https://github.com/changesets/action) is merged.
The [`Changesets Release Action`](https://github.com/changesets/action) must be configured to work in a separate workflow.

```yml
name: Release

on:
  pull_request_target:
    types:
      - closed
    branches:
      - main

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    name: release

    permissions:
      contents: write

    if: github.event.pull_request.merged == true && startsWith(github.head_ref, 'changeset-release/main')
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Release
        uses: 108yen/changeset-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Example of using output

```yml
name: Release

on:
  pull_request_target:
    types:
      - closed
    branches:
      - main

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    name: release

    permissions:
      contents: write

    if: github.event.pull_request.merged == true && startsWith(github.head_ref, 'changeset-release/main')
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Release
        id: release
        uses: 108yen/changeset-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Display Tag
        run: echo '${{ steps.release.outputs.tag }}'
```
