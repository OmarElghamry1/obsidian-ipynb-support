import {
  MarkdownRenderer,
  TFile,
  TextFileView,
  WorkspaceLeaf,
} from "obsidian";

export const IPYNB_VIEW_TYPE = "ipynb-view";

type NbCell = {
  cell_type: "markdown" | "code";
  source: string[] | string;
  outputs?: any[];
};

type NbJson = {
  cells?: NbCell[];
  // we ignore metadata, nbformat, etc. for now
};

export class IpynbView extends TextFileView {
  containerEl: HTMLElement;
  private currentData: string = "";

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
    this.containerEl = this.contentEl;
    this.containerEl.addClass("ipynb-viewer");
  }

  getViewType(): string {
    return IPYNB_VIEW_TYPE;
  }

  getDisplayText(): string {
    return this.file?.basename ?? "Notebook";
  }

  getIcon(): string {
    // Any Obsidian icon name; "code" is nice for notebooks
    return "code";
  }

  /**
   * Called when a file is loaded into this view.
   */
  async onLoadFile(file: TFile): Promise<void> {
    await super.onLoadFile(file);
    const raw = await this.app.vault.read(file);
    this.currentData = raw;
    await this.renderNotebook(raw);
  }

  /**
   * Render the entire notebook from raw JSON.
   */
  async renderNotebook(raw: string): Promise<void> {
    this.containerEl.empty();

    let nb: NbJson;
    try {
      nb = JSON.parse(raw);
    } catch (e) {
      this.containerEl.createEl("pre", {
        text:
          "Invalid .ipynb JSON\n\n" +
          (e instanceof Error ? e.message : String(e)),
      });
      return;
    }

    const cells = nb.cells ?? [];
    if (!cells.length) {
      this.containerEl.createEl("div", {
        text: "Empty notebook.",
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

  private getSource(cell: NbCell): string {
    const src = cell.source ?? "";
    if (Array.isArray(src)) return src.join("");
    return src;
  }

  /**
   * Render markdown cell using Obsidian's MarkdownRenderer.
   */
  async renderMarkdownCell(cell: NbCell): Promise<void> {
    const markdown = this.getSource(cell);
    const block = this.containerEl.createDiv("ipynb-markdown-cell");

    await MarkdownRenderer.renderMarkdown(
      markdown,
      block,
      this.file?.path ?? "",
      this
    );
  }

  /**
   * Render code cell as a code block.
   */
  renderCodeCell(cell: NbCell): void {
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
  renderOutputs(cell: NbCell): void {
    const outputs = cell.outputs || [];
    if (!outputs.length) return;

    const outContainer = this.containerEl.createDiv(
      "ipynb-output-container"
    );

    for (const out of outputs) {
      // Jupyter output variants are a bit messy; we handle a few common cases.
      const data = out.data ?? {};
      const textData =
        data["text/markdown"] ??
        data["text/plain"] ??
        out.text ??
        out["text"];

      if (textData) {
        const txt = Array.isArray(textData)
          ? textData.join("")
          : String(textData);

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
        const htmlStr = Array.isArray(htmlData)
          ? htmlData.join("")
          : String(htmlData);
        const div = outContainer.createDiv("ipynb-output-html");
        div.innerHTML = htmlStr;
      }
    }
  }

  /**
   * Required by TextFileView: return the textual data of the view.
   * For us, that's just the raw .ipynb JSON string.
   */
  getViewData(): string {
    return this.currentData;
  }

  /**
   * Required by TextFileView: set the textual data of the view.
   * Obsidian uses this when loading / reloading the file.
   */
  setViewData(data: string, clear: boolean): void {
    this.currentData = data;

    if (clear) {
      this.containerEl.empty();
    }

    // Fire-and-forget async render; setViewData must be sync.
    void this.renderNotebook(data);
  }

  /**
   * Required by TextFileView: clear the view when switching files.
   */
  clear(): void {
    this.currentData = "";
    this.containerEl.empty();
  }

  /**
   * Read-only: we don't support editing .ipynb in this view.
   */
  async onSave(): Promise<void> {
    // If you later want editing, implement saving here.
    return;
  }

  /**
   * Tell Obsidian this view can handle .ipynb.
   */
  canAcceptExtension(ext: string): boolean {
    return ext === "ipynb";
  }
}
