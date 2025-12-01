import { Plugin, WorkspaceLeaf, TFile } from "obsidian";
import { IpynbView, IPYNB_VIEW_TYPE } from "./ipynbView";

export default class IpynbViewerPlugin extends Plugin {
  async onload() {
    console.log("Loading IPYNB Viewer plugin");

    // Register view type
    this.registerView(IPYNB_VIEW_TYPE, (leaf: WorkspaceLeaf) => {
      return new IpynbView(leaf);
    });

    // Associate .ipynb files with this view
    this.registerExtensions(["ipynb"], IPYNB_VIEW_TYPE);

    // Command to reopen current file as notebook view
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
      },
    });
  }

  async activateIpynbView(file: TFile) {
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(file);

    await leaf.setViewState({
      type: IPYNB_VIEW_TYPE,
      active: true,
      state: { file: file.path },
    });

    this.app.workspace.revealLeaf(leaf);
  }

  onunload() {
    console.log("Unloading IPYNB Viewer plugin");
    this.app.workspace
      .getLeavesOfType(IPYNB_VIEW_TYPE)
      .forEach((leaf) => leaf.detach());
  }
}