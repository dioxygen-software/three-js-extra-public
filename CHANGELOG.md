# Changelog

Each version is a branch named `r<version>.<three.js revision>`: `r3.130` is version 3, for three.js r130.
A version branch only receives backward-compatible changes, so pulling its latest commit is safe; a change that
breaks users of the repository starts a new version. Each version below says what changed since the previous one,
breaking changes first. Versions are listed newest first; a version in development may still change.

This repository has no version branch for three.js r130: `main` plays that role.

## r2.170 (2026-02)

The `main` code, as of 2024-07, for three.js r170. Not included: the `FPSCounter` utility, added to `main` later.

**Breaking changes**
- three.js r170.

## main (2024-05 to 2025-01)

**Breaking changes**
- Written in TypeScript. `Ray.intersectCone` and `Ray.intersectConeFrustum` renamed to follow three.js naming;
  `Cone` and `ConeFrustum` moved to a `math` folder.

**Changes**
- `EdgeSplitModifier` in TypeScript, with tests; materials migrated.
- Fix: `MeshNormalWorldMaterial` no longer throws when it should not.
- `FPSCounter` utility.
