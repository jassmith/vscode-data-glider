import type {
  RendererContext,
  OutputItem
} from 'vscode-notebook-renderer';

// import renderer styles, see: https://github.com/css-modules/css-modules
import * as style from './style.css';

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
export function render(renderInfo: IRenderInfo) {
  const pre = document.createElement('pre');
  pre.classList.add(style.json);
  const code = document.createElement('code');
  code.textContent = `mime type: ${renderInfo.mimeType}\n\n${JSON.stringify(renderInfo.outputItem.json(), null, 2)}`;
  pre.appendChild(code);
  renderInfo.container.appendChild(pre);
}

if (module.hot) {
  module.hot.addDisposeHandler(() => {
    // TODO: clean up or stash renderer state on reload
  });
}
