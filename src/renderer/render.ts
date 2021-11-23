import type {
  RendererContext,
  OutputItem
} from 'vscode-notebook-renderer';

import { DataLoader } from './dataLoader';

// import renderer styles, see: https://github.com/css-modules/css-modules
import './styles/data-glider.css';

const htl = require('htl');

/**
 * Notebook cell output renderer info.
 */
interface IRenderInfo {
  container: HTMLElement;
  outputItem: OutputItem;
  mimeType: string;
  context: RendererContext<unknown>;
}

/**
 * Renders notebook cell output.
 * @param param0 
 */
export function render(output: IRenderInfo) {
  console.log(`data.glider:mimeType: ${output.mimeType}`);

  // load and parse output data
  const dataLoader: DataLoader = new DataLoader(output.outputItem, output.mimeType);
  let data: any = dataLoader.getData();

  // create text output display for now
  const pre = document.createElement('pre');
  pre.className = 'text-output';
  const code = document.createElement('code');
  if (typeof data !== 'string') {
    // stringify json data
    code.textContent = JSON.stringify(data, null, 2);
  }
  else {
    // show cell output text
    code.textContent = output.outputItem.text();
  }
  pre.appendChild(code);
  output.container.appendChild(pre);
}

if (module.hot) {
  module.hot.addDisposeHandler(() => {
    // TODO: clean up or stash renderer state on reload
  });
}
