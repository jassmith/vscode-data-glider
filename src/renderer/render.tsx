import type {
  RendererContext,
  OutputItem
} from 'vscode-notebook-renderer';

import { DataLoader } from './dataLoader';

// import renderer styles, see: https://github.com/css-modules/css-modules
import './styles/data-glider.css';
import * as ReactDOM from "react-dom";

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


  ReactDOM.render(<h1>Test</h1>, output.container);
}

if (module.hot) {
  module.hot.addDisposeHandler(() => {
    // TODO: clean up or stash renderer state on reload
  });
}
