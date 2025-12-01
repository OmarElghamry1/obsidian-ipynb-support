# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Obsidian plugin that renders Jupyter notebook (.ipynb) files directly inside Obsidian. The plugin registers a custom view type that parses and displays notebook cells, including markdown, code, and outputs (text, images, HTML).

## Build Commands

- **Development mode with watch**: `npm run dev`
  - Watches for file changes and rebuilds automatically
  - Uses esbuild with watch mode

- **Production build**: `npm run build`
  - Creates optimized build in `main.js`

## Architecture

### Entry Point
- `src/main.ts`: Plugin entry point that extends Obsidian's `Plugin` class
  - Registers the IPYNB view type
  - Associates `.ipynb` file extension with the custom view
  - Adds command to open current file as notebook
  - Handles plugin load/unload lifecycle

### Core View Implementation
- `src/ipynbView.ts`: Custom view that extends `TextFileView`
  - Parses .ipynb JSON structure
  - Renders three cell types:
    - **Markdown cells**: Uses Obsidian's `MarkdownRenderer` to render markdown with full Obsidian features
    - **Code cells**: Displays code in styled pre/code blocks with "In [ ]:" headers
    - **Outputs**: Renders text/plain, text/markdown, text/html, and image/png outputs
  - Read-only view (saving is no-op)
  - Implements required TextFileView methods: `getViewData()`, `setViewData()`, `clear()`

### Styling
- `styles.css`: CSS classes for notebook rendering
  - Uses Obsidian CSS variables for theme compatibility
  - Styled classes: `.ipynb-viewer`, `.ipynb-markdown-cell`, `.ipynb-code-cell`, `.ipynb-output-container`, etc.

### Build Configuration
- `esbuild.config.mjs`: ESBuild configuration
  - Entry: `src/main.ts` → Output: `main.js`
  - Bundle format: CommonJS for Obsidian compatibility
  - Platform: browser
  - External: `obsidian` (provided by Obsidian runtime)
  - Target: ES2020

## TypeScript Configuration
- Strict mode enabled with strict null checks
- Module resolution: bundler
- Inline source maps for debugging
- Types: node, obsidian

## Key Implementation Details

1. **View Registration**: The plugin uses `registerView()` and `registerExtensions()` to associate .ipynb files with the custom view type
2. **Notebook Structure**: Expects standard Jupyter notebook JSON format with `cells` array containing objects with `cell_type`, `source`, and optional `outputs`
3. **Source Handling**: Cell sources can be either string or string[] (lines); the view normalizes both
4. **Output Rendering**: Supports multiple output formats but prioritizes text/markdown, text/plain, image/png, and text/html
5. **Obsidian Integration**: Uses `MarkdownRenderer.renderMarkdown()` for markdown cells to maintain Obsidian features like wikilinks
