# Standalone Projects

This folder is the repo-friendly home for exported LEGO mosaic motion bundles.

Use it when you want to:

- commit finished project files directly to GitHub
- let people inspect `project.json`, `piece-list.json`, and rendered assets without using the main website
- open a local viewer and scrub through the animation from `project.json`

## What Goes Here

Put each exported bundle in its own subfolder under `projects/`.

Suggested structure:

```text
standalone-projects/
  index.html
  projects/
    your-project-name/
      README.txt
      project.json
      piece-list.json
      piece-list.csv
      frames/
      renders/
```

The app already exports files in this shape, so you can usually unzip a project package and drop it in with minimal cleanup.

## How To Use The Viewer

1. Open `standalone-projects/index.html` in a browser.
2. Click `Load Project JSON` and choose any exported `project.json`.
3. Scrub through frames, inspect colors, and review per-frame piece counts.

If you are serving the repo locally or through GitHub Pages, you can also use the built-in demo bundle from `projects/demo-project/`.

## Notes

- The viewer reconstructs frames from `project.json`, so it does not need the PNG frames to preview the animation.
- The `pieces` block inside `project.json` mirrors the exported `piece-list.json` summary.
- `paletteRuns` use row-major run-length encoding from top-left to bottom-right.
