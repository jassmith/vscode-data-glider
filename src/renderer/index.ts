import type {
  ActivationFunction,
  RendererContext,
  OutputItem
} from 'vscode-notebook-renderer';
import errorOverlay from 'vscode-notebook-error-overlay';
import { render } from './render';

// Fix the public path so that any async import()'s work as expected.
// eslint-disable-next-line @typescript-eslint/naming-convention
declare const __webpack_relative_entrypoint_to_root__: string;
declare const scriptUrl: string;
__webpack_public_path__ = new URL(scriptUrl.replace(/[^/]+$/, '') + 
  __webpack_relative_entrypoint_to_root__).toString();

export const activate: ActivationFunction = (context: RendererContext<unknown>) => {
  return {
    renderOutputItem(outputItem: OutputItem, cellOutputElement: HTMLElement) {
      errorOverlay.wrap(cellOutputElement, () => {
        // clear prior cell output
        cellOutputElement.innerHTML = '';

        // create data glider view container
        const outputContainerElement: HTMLDivElement = document.createElement('div');
        outputContainerElement.className = 'data-glider';
        cellOutputElement.appendChild(outputContainerElement);
        render({
          container: outputContainerElement,
          outputItem: outputItem,
          mimeType: outputItem.mime,
          context
        });
      });
    },
    disposeOutputItem(outputId) {
      // TODO: add treardown code here to dispose rendered output
      // Note: outputId is the cell output being cleared.
      // It's undefined if we're clearing all outputs.
    }
  };
};
