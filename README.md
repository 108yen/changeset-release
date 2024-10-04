# 108yen/changeset-release

This action extracts the process of creating a release to github from [`Changesets Release Action`](https://github.com/changesets/action).
This allows for release whenever you want.

## Usage

### Inputs

- format: Release tag format. Choose one of these. Default is `prefix`.
  - full: `package@1.0.0`
  - major: `v1`
  - prefix `v1.0.0`
  - simple `1.0.0`

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
        run: 108yen/changeset-release@v1
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
        run: 108yen/changeset-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Display Tag
        run: echo '${{ steps.release.outputs.tag }}'
```
