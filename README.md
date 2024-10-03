This action extracts the process of creating a release to github from [`Changesets Release Action`](https://github.com/changesets/action).
This allows for release whenever you want.

## Usage

### Outputs

- releaseTag: Release tag. (Example: `v1.0.0`)

### Example workflow

This is an example of a release workflow that works when a PR issued by [`Changesets Release Action`](https://github.com/changesets/action) is merged.

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

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Create release
        run: 108yen/changeset-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
