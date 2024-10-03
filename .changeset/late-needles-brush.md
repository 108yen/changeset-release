---
"changeset-release": patch
---

Fix build script so that `JasonEtco/build-and-tag-action@v2` copy only `dist/index.js` and `action.yml`. If other file exist, that is not contain release and not found error occurred.
