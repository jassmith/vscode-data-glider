import { ExtensionContext } from 'vscode';

export function activate(context: ExtensionContext) {
  console.log(`glide.data.grid: activated`);
}

export function deactivate() {
  console.log(`glid.data.grid: deactivated`);
}
