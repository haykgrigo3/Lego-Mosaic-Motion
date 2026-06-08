# Lego-Mosaic-Motion

Browser-based tool for turning short video clips into LEGO-style mosaic motion pieces.

This project is not affiliated with The Lego Group

Turn any video into a lego mosaic motion video

This is not a filter

![Lego Mosaic Motion Demo](topuria-ufc-lego-mosaic-loop.gif)

each frame has been converted to a lego mosaic

## What It Does

- uploads a video clip directly in the browser
- lets you crop, scale, and recolor the shot
- converts frames into larger-format LEGO-style mosaics
- exports a silent motion video
- exports a project ZIP with:
  - `project.json`
  - `piece-list.json`
  - `piece-list.csv`
  - optional PNG frames

## Main App

The website entry point lives here:

- `app/index.html`

The main motion pipeline lives here:

- `app/js/motion-studio.js`

## Standalone Project Bundles

Repo-friendly standalone project files live here:

- `standalone-projects/`

That folder includes:

- a local `project.json` viewer
- a `projects/` directory for committed bundles
- a bundled demo project

## Blender 

You can make the Mosaic videos look much better by rendering them in blender. 

