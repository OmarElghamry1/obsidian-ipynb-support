# Obsidian IPYNB Viewer

Preview Jupyter notebook (.ipynb) files directly inside Obsidian.

## Features

- **Render Jupyter Notebooks**: View .ipynb files with proper formatting
- **Markdown Cell Support**: Renders markdown cells using Obsidian's native markdown renderer, supporting all Obsidian features like wikilinks
- **Code Cell Display**: Shows code cells with proper formatting and "In [ ]:" indicators
- **Output Rendering**: Displays cell outputs including:
  - Text/plain output
  - Text/markdown output
  - Text/HTML output
  - PNG images (base64 encoded)
- **Desktop Only**: Optimized for Obsidian desktop app

## Installation

### From GitHub

1. Download the latest release from the [Releases page](https://github.com/OmarElghamry1/obsidian-ipynb-support/releases)
2. Extract the files to your vault's `.obsidian/plugins/obsidian-ipynb-viewer/` directory
3. Reload Obsidian
4. Enable the plugin in Settings → Community Plugins

### Manual Installation

1. Clone this repository into your vault's plugin folder:
   ```bash
   cd /path/to/vault/.obsidian/plugins
   git clone https://github.com/OmarElghamry1/obsidian-ipynb-support.git obsidian-ipynb-viewer
   cd obsidian-ipynb-viewer
   ```

2. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```

3. Reload Obsidian and enable the plugin

## Usage

Once installed, the plugin automatically registers .ipynb files. Simply click on any .ipynb file in your vault to view it.

You can also use the command palette:
- `Ctrl/Cmd + P` → "Open current file as Jupyter Notebook"

## Development

### Prerequisites

- Node.js (v20+)
- npm

### Building

```bash
# Install dependencies
npm install

# Development mode (watch for changes)
npm run dev

# Production build
npm run build
```

### Project Structure

- `src/main.ts` - Plugin entry point, registers view and commands
- `src/ipynbView.ts` - Custom view implementation for rendering notebooks
- `styles.css` - Styling for notebook cells and outputs
- `esbuild.config.mjs` - Build configuration

## Limitations

- Read-only viewing (editing not currently supported)
- Limited output format support (no SVG, LaTeX, or interactive widgets yet)
- No execution count display
- No syntax highlighting for code cells

See [enhancements.md](enhancements.md) for planned improvements.

## License

MIT

## Credits

Created by Omar Elghamry. 
