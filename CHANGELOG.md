# changeset-release

## 1.2.4

### Patch Changes

- [#162](https://github.com/108yen/changeset-release/pull/162) [`dd4b13e`](https://github.com/108yen/changeset-release/commit/dd4b13ebd45564624eda6d6e9e25f4302f0ccaf7) Thanks [@108yen](https://github.com/108yen)! - Set `github_tokne` to default input

- [#162](https://github.com/108yen/changeset-release/pull/162) [`6ddd381`](https://github.com/108yen/changeset-release/commit/6ddd3814a501e07920e9413c656943d8fbac5124) Thanks [@108yen](https://github.com/108yen)! - Check exist content of specified version in `CHANGELOG.md`.

## 1.2.3

### Patch Changes

- [#52](https://github.com/108yen/changeset-release/pull/52) [`19f57f3`](https://github.com/108yen/changeset-release/commit/19f57f3c95c19248693a946dfa20f898762d950f) Thanks [@108yen](https://github.com/108yen)! - Fixed release workflow. Generate tag force.

## 1.2.2

### Patch Changes

- [#50](https://github.com/108yen/changeset-release/pull/50) [`e665d03`](https://github.com/108yen/changeset-release/commit/e665d03f6fd7b2f13338e94573a69308dd10352c) Thanks [@108yen](https://github.com/108yen)! - Fixed release workflow failed. We need to setup git config to run update tags script.

## 1.2.1

### Patch Changes

- [#48](https://github.com/108yen/changeset-release/pull/48) [`b24ace7`](https://github.com/108yen/changeset-release/commit/b24ace7c080f17f3e3b677121ba5e3d73f710f33) Thanks [@108yen](https://github.com/108yen)! - Update build command to generate licenses, source map.

## 1.2.0

### Minor Changes

- [#44](https://github.com/108yen/changeset-release/pull/44) [`3036e09`](https://github.com/108yen/changeset-release/commit/3036e0963002944aa088ae17e58e941901f52ac1) Thanks [@108yen](https://github.com/108yen)! - Added the ability to specify the target (branch or commit) for creating a release.

## 1.1.0

### Minor Changes

- [#42](https://github.com/108yen/changeset-release/pull/42) [`599fc39`](https://github.com/108yen/changeset-release/commit/599fc39583a687ea8865be4da2e2f4866f8c7236) Thanks [@108yen](https://github.com/108yen)! - Added ability of change tag format.

## 1.0.11

### Patch Changes

- [#40](https://github.com/108yen/changeset-release/pull/40) [`269ca9e`](https://github.com/108yen/changeset-release/commit/269ca9e87f24cb4e91ae73d31e19022420415079) Thanks [@108yen](https://github.com/108yen)! - Fix publish action. Wrong commit hash was set. And set `template` parameter of publish.

## 1.0.10

### Patch Changes

- [#36](https://github.com/108yen/changeset-release/pull/36) [`b1fb03c`](https://github.com/108yen/changeset-release/commit/b1fb03c196ad776ba5f578b4bff5e343dc17d424) Thanks [@108yen](https://github.com/108yen)! - Added error handling for failed `createRelease` using `octokit`.

- [#34](https://github.com/108yen/changeset-release/pull/34) [`03fdc43`](https://github.com/108yen/changeset-release/commit/03fdc438d3ffcca399333adf3d8071e0cb9a7ecf) Thanks [@108yen](https://github.com/108yen)! - Change action name.

## 1.0.9

### Patch Changes

- [#31](https://github.com/108yen/changeset-release/pull/31) [`b998853`](https://github.com/108yen/changeset-release/commit/b9988532d6317086a8c352560b1ad902b41f957d) Thanks [@108yen](https://github.com/108yen)! - Fix build script so that `JasonEtco/build-and-tag-action@v2` copy only `dist/index.js` and `action.yml`. If other file exist, that is not contain release and not found error occurred.

## 1.0.8

### Patch Changes

- [#29](https://github.com/108yen/changeset-release/pull/29) [`adb1c69`](https://github.com/108yen/changeset-release/commit/adb1c69e6cf9b1b0e59d5b41d3af882ab343032b) Thanks [@108yen](https://github.com/108yen)! - Restore display tag and tag_name parameter.

## 1.0.7

### Patch Changes

- [#27](https://github.com/108yen/changeset-release/pull/27) [`48c6178`](https://github.com/108yen/changeset-release/commit/48c617831645c234b4e205896877b23f0defbd92) Thanks [@108yen](https://github.com/108yen)! - Fixed set workflow output.

## 1.0.6

### Patch Changes

- [#25](https://github.com/108yen/changeset-release/pull/25) [`2931876`](https://github.com/108yen/changeset-release/commit/293187685a9b133383e85f69574bbc326bb6b19b) Thanks [@108yen](https://github.com/108yen)! - Added tag display step and tag_name parameter to Publish step.

## 1.0.5

### Patch Changes

- [#23](https://github.com/108yen/changeset-release/pull/23) [`35b2eda`](https://github.com/108yen/changeset-release/commit/35b2edafd7d384518afb2ce80faaa7b7f8ac4d51) Thanks [@108yen](https://github.com/108yen)! - Separate release and publish jobs to fetch release tag.

## 1.0.4

### Patch Changes

- [#21](https://github.com/108yen/changeset-release/pull/21) [`d068a6d`](https://github.com/108yen/changeset-release/commit/d068a6df3137f753d4f9454a5f891cea16008664) Thanks [@108yen](https://github.com/108yen)! - Fixed release workflow. Build-and-tag-action needs `tag_name`. And update output name to tag.

## 1.0.3

### Patch Changes

- [#17](https://github.com/108yen/changeset-release/pull/17) [`46a5831`](https://github.com/108yen/changeset-release/commit/46a58318baf4a2e870be038e9c70c33ee79eaae2) Thanks [@108yen](https://github.com/108yen)! - Update publish workflow trigger. Publish workflow triggered after release workflow.

- [#19](https://github.com/108yen/changeset-release/pull/19) [`ad8f754`](https://github.com/108yen/changeset-release/commit/ad8f7549ffd87e23fdbbbbf1dd6b971648d19f28) Thanks [@108yen](https://github.com/108yen)! - Fixed publish workflow. Concat release and publish workflow.

## 1.0.2

### Patch Changes

- [#15](https://github.com/108yen/changeset-release/pull/15) [`212730d`](https://github.com/108yen/changeset-release/commit/212730d11f1f91969c7343e20f9c79bdb8dc303b) Thanks [@108yen](https://github.com/108yen)! - Added `branding` metadata.

## 1.0.1

### Patch Changes

- [#13](https://github.com/108yen/changeset-release/pull/13) [`aa4043e`](https://github.com/108yen/changeset-release/commit/aa4043e8d1e01905746508c2a760036367543161) Thanks [@108yen](https://github.com/108yen)! - Fixed wrong option.

## 1.0.0

### Major Changes

- [#8](https://github.com/108yen/changeset-release/pull/8) [`a491f17`](https://github.com/108yen/changeset-release/commit/a491f17d82d425b39a960292728e1a5d949f9e6e) Thanks [@108yen](https://github.com/108yen)! - Added release script.

### Minor Changes

- [#1](https://github.com/108yen/changeset-release/pull/1) [`43f0fa9`](https://github.com/108yen/changeset-release/commit/43f0fa9759860921c4ccc993a98f3ba47d0f1419) Thanks [@108yen](https://github.com/108yen)! - Added github actions workflow that create release pull request and create github release

- [#1](https://github.com/108yen/changeset-release/pull/1) [`863fd91`](https://github.com/108yen/changeset-release/commit/863fd9120fb17fdb65cd126010ca2a40bd7ea73e) Thanks [@108yen](https://github.com/108yen)! - added quality workflow

- [#9](https://github.com/108yen/changeset-release/pull/9) [`e5bf35f`](https://github.com/108yen/changeset-release/commit/e5bf35f3b4fa8772456ffd59bfa4271d77ff9454) Thanks [@108yen](https://github.com/108yen)! - Added `action.yml` and added `releaseTag` output.
