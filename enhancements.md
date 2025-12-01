# Obsidian IPYNB Viewer - Enhancement Suggestions

## Quick Wins

### 1. Syntax Highlighting for Code Cells
- Currently code cells are plain text (ipynbView.ts:122)
- Could use Obsidian's syntax highlighting or a library like Prism.js
- Would need to detect language from notebook metadata

### 2. Display Execution Counts
- Notebook cells have execution_count metadata
- Currently shows "In [ ]:" but could show "In [5]:" (ipynbView.ts:118)
- Type definition needs expansion to include `execution_count` field

### 3. Error Output Formatting
- Jupyter notebooks have error/traceback outputs
- Currently not handled in renderOutputs (ipynbView.ts:128-171)
- Could add special styling for error messages and stack traces

### 4. Copy Code Button
- Add a button to copy code from code cells
- Common UX pattern in documentation sites
- Could use Obsidian's `navigator.clipboard` API

## Medium Complexity

### 5. Additional Output Formats
- **SVG images**: `data["image/svg+xml"]`
- **LaTeX/Math**: `data["text/latex"]` - could use MathJax or KaTeX
- **JSON**: `data["application/json"]` - formatted display
- Currently only handles text, HTML, and PNG (ipynbView.ts:136-170)

### 6. Collapsible Cells
- Add toggle to collapse/expand individual cells
- Useful for large notebooks
- Store state in view or component state

### 7. Cell Metadata Display
- Show cell execution time if available
- Display tags, slide type, or other metadata
- Could be toggleable via settings

### 8. Table of Contents
- Generate TOC from markdown headers
- Sidebar navigation for large notebooks
- Could use Obsidian's outline view integration

### 9. Search Within Notebook
- Search across all cells
- Highlight matches
- Navigate between results

## More Involved

### 10. Export Capabilities
- Export to HTML
- Export to PDF
- Export individual cells as markdown files
- Could add ribbon icon or command

### 11. Settings/Configuration
- Toggle output rendering on/off
- Default code language for highlighting
- Max image dimensions
- Cell display options

### 12. Edit Support
- Currently read-only (ipynbView.ts:207-210)
- Enable editing cell content
- Save back to .ipynb format
- Would need proper JSON serialization

### 13. Raw Cell Support
- Notebooks can have "raw" cell types
- Currently only handles "markdown" and "code" (ipynbView.ts:10)
- Usually rendered as plaintext

### 14. Widget/Interactive Output Support
- Some notebooks have ipywidgets
- Would require JavaScript execution context
- Complex but valuable for data science notebooks

### 15. Performance Optimization
- Lazy loading for large notebooks
- Virtual scrolling for many cells
- Debounced rendering
- Currently renders all cells at once (ipynbView.ts:80-87)

## Recommended Starting Points

### Low-Hanging Fruit (High Impact, Low Effort)
1. **Execution count display** - minimal change to line 118 in ipynbView.ts
2. **Error output formatting** - expand renderOutputs method to handle error outputs
3. **SVG and LaTeX output support** - add cases to renderOutputs method
4. **Copy code button** - small UX improvement with high utility
