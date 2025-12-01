"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => IpynbViewerPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");

// src/ipynbView.ts
var import_obsidian = require("obsidian");
var IPYNB_VIEW_TYPE = "ipynb-view";
var IpynbView = class extends import_obsidian.TextFileView {
  constructor(leaf) {
    super(leaf);
    this.currentData = "";
    this.containerEl = this.contentEl;
    this.containerEl.addClass("ipynb-viewer");
  }
  getViewType() {
    return IPYNB_VIEW_TYPE;
  }
  getDisplayText() {
    return this.file?.basename ?? "Notebook";
  }
  getIcon() {
    return "code";
  }
  /**
   * Called when a file is loaded into this view.
   */
  async onLoadFile(file) {
    await super.onLoadFile(file);
    const raw = await this.app.vault.read(file);
    this.currentData = raw;
    await this.renderNotebook(raw);
  }
  /**
   * Render the entire notebook from raw JSON.
   */
  async renderNotebook(raw) {
    this.containerEl.empty();
    let nb;
    try {
      nb = JSON.parse(raw);
    } catch (e) {
      this.containerEl.createEl("pre", {
        text: "Invalid .ipynb JSON\n\n" + (e instanceof Error ? e.message : String(e))
      });
      return;
    }
    const cells = nb.cells ?? [];
    if (!cells.length) {
      this.containerEl.createEl("div", {
        text: "Empty notebook."
      });
      return;
    }
    for (const cell of cells) {
      if (cell.cell_type === "markdown") {
        await this.renderMarkdownCell(cell);
      } else if (cell.cell_type === "code") {
        this.renderCodeCell(cell);
        this.renderOutputs(cell);
      }
    }
  }
  getSource(cell) {
    const src = cell.source ?? "";
    if (Array.isArray(src)) return src.join("");
    return src;
  }
  /**
   * Render markdown cell using Obsidian's MarkdownRenderer.
   */
  async renderMarkdownCell(cell) {
    const markdown = this.getSource(cell);
    const block = this.containerEl.createDiv("ipynb-markdown-cell");
    await import_obsidian.MarkdownRenderer.renderMarkdown(
      markdown,
      block,
      this.file?.path ?? "",
      this
    );
  }
  /**
   * Render code cell as a code block.
   */
  renderCodeCell(cell) {
    const code = this.getSource(cell);
    const block = this.containerEl.createDiv("ipynb-code-cell");
    const header = block.createDiv("ipynb-code-header");
    header.setText("In [ ]:");
    const pre = block.createEl("pre");
    const codeEl = pre.createEl("code");
    codeEl.textContent = code;
  }
  /**
   * Render cell outputs (basic types: text, image/png, text/html).
   */
  renderOutputs(cell) {
    const outputs = cell.outputs || [];
    if (!outputs.length) return;
    const outContainer = this.containerEl.createDiv(
      "ipynb-output-container"
    );
    for (const out of outputs) {
      const data = out.data ?? {};
      const textData = data["text/markdown"] ?? data["text/plain"] ?? out.text ?? out["text"];
      if (textData) {
        const txt = Array.isArray(textData) ? textData.join("") : String(textData);
        const pre = outContainer.createEl("pre");
        pre.addClass("ipynb-output-text");
        pre.textContent = txt;
      }
      const imgData = data["image/png"];
      if (imgData) {
        const img = outContainer.createEl("img");
        img.src = "data:image/png;base64," + imgData;
        img.addClass("ipynb-output-image");
      }
      const htmlData = data["text/html"];
      if (htmlData) {
        const htmlStr = Array.isArray(htmlData) ? htmlData.join("") : String(htmlData);
        const div = outContainer.createDiv("ipynb-output-html");
        div.innerHTML = htmlStr;
      }
    }
  }
  /**
   * Required by TextFileView: return the textual data of the view.
   * For us, that's just the raw .ipynb JSON string.
   */
  getViewData() {
    return this.currentData;
  }
  /**
   * Required by TextFileView: set the textual data of the view.
   * Obsidian uses this when loading / reloading the file.
   */
  setViewData(data, clear) {
    this.currentData = data;
    if (clear) {
      this.containerEl.empty();
    }
    void this.renderNotebook(data);
  }
  /**
   * Required by TextFileView: clear the view when switching files.
   */
  clear() {
    this.currentData = "";
    this.containerEl.empty();
  }
  /**
   * Read-only: we don't support editing .ipynb in this view.
   */
  async onSave() {
    return;
  }
  /**
   * Tell Obsidian this view can handle .ipynb.
   */
  canAcceptExtension(ext) {
    return ext === "ipynb";
  }
};

// src/main.ts
var IpynbViewerPlugin = class extends import_obsidian2.Plugin {
  async onload() {
    console.log("Loading IPYNB Viewer plugin");
    this.registerView(IPYNB_VIEW_TYPE, (leaf) => {
      return new IpynbView(leaf);
    });
    this.registerExtensions(["ipynb"], IPYNB_VIEW_TYPE);
    this.addCommand({
      id: "open-current-as-ipynb",
      name: "Open current file as Jupyter Notebook",
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        if (!file || file.extension !== "ipynb") return false;
        if (!checking) {
          this.activateIpynbView(file);
        }
        return true;
      }
    });
  }
  async activateIpynbView(file) {
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(file);
    await leaf.setViewState({
      type: IPYNB_VIEW_TYPE,
      active: true,
      state: { file: file.path }
    });
    this.app.workspace.revealLeaf(leaf);
  }
  onunload() {
    console.log("Unloading IPYNB Viewer plugin");
    this.app.workspace.getLeavesOfType(IPYNB_VIEW_TYPE).forEach((leaf) => leaf.detach());
  }
};
