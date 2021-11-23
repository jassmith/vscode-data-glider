import type { OutputItem } from 'vscode-notebook-renderer';
import { csvParse } from 'd3-dsv';

/**
 * DataLoader loads data from notebook cell output item.
 */
export class DataLoader {

  /**
   * Creates new DataLoader instance.
   * @param outputData Notebook cell output item.
   * @param mimeType Notebook cell output mime type.
   */
  constructor(private outputData: OutputItem, private mimeType: string) {
  }


  /**
   * Gets data output.
   */
  getData(): any {
    // try getting JSON data first
    const objectData = this.getJsonData(this.outputData);
    if (objectData !== undefined) {
      return objectData;
    }

    // try parsing text data
    let textData: string = this.outputData.text();
    if (textData.length > 0) {
      // console.log('data.glider:text:', textData.substring(0, Math.min(80, textData.length)), '...');
      // see if text data is in json data format
      const jsonData = this.getJsonData(textData);
      if (jsonData !== undefined) {
        return jsonData;
      }
      else if (this.isCsv(textData)) {
        // parse CSV data
        return csvParse(textData);
      }
      else if (textData !== '{}' && !textData.startsWith('<Buffer ')) { // empty object or binary data
        return textData;
      }
    }

    return this.outputData;
  }

  /**
   * Gets JSON data array, JSON object string, 
   * CSV rows data array, or undefined 
   * for plain text and binary data types.
   * @param data Notebook output data value.
   */
  getJsonData(data: any): any {
    // console.log('data.glider:json:', data);
    try {
      if (typeof data === 'string') {
        // try parsing JSON string
        let objectData: any = JSON.parse(data);
        if (objectData.data) {
          // use data object from REST response
          objectData = objectData.data;
        }

        if (Array.isArray(objectData)) {
          console.log('data.glider:format: JSON array');
          return objectData;
        }
        else {
          console.log('data.glider:format: JSON');
          return objectData;
        }
      }

      // try getting json data object
      // console.log('data.glider:json:', data);
      let jsonData: any = data.json();
      if (jsonData.data) {
        // use data object from REST response
        jsonData = jsonData.data;
      }

      if (Array.isArray(jsonData)) {
        console.log('data.glider:format: JSON array');
        return jsonData;
      }
      else {
        console.log('data.glider:format: JSON');
      }

      if (typeof jsonData === 'string' && this.isCsv(jsonData)) {
        // parse CSV data for JSON response from REST Book
        // see: https://github.com/tanhakabir/rest-book/issues/114
        return csvParse(jsonData);
      }
    }
    catch (error: any) {
      console.log('data.glider: JSON.parse error:\n', error.message);
    }
    return undefined;
  }

  /**
   * Checks if text content is in CSV format.
   * @param text Text content to check.
   */
  isCsv(text: string): boolean {
    if (text === undefined || text.length === 0) {
      return false;
    }

    // get text lines
    const maxLines: number = 10;
    const lines: string[] = text.trimEnd().split('\n', maxLines);
    const minRows: number = Math.min(lines.length, maxLines);

    if (lines.length > 0) {
      // console.log('data.glider:lines:', lines);
      const columns: string[] = lines[0].split(',');
      const columnCount = columns.length;

      if (columnCount > 1) {
        console.log('data.glider:columns:', columns);
        // check columns for garbled json
        for (let k = 0; k < columnCount; k++) {
          let columnName: string = columns[k];
          if (columnName.startsWith('[') || columnName.startsWith('{')) {
            return false;
          }
        }

        // do naive check for some commas in the first 9 rows
        for (let i = 1; i < minRows; i++) {
          const columnValues: string[] = lines[i].split(',');
          // console.log(`data.glider:row[${i}]`, columnValues);
          if (columnValues.length < columnCount) {
            return false;
          }
        }
        console.log('data.glider:format: CSV');
        return true;
      }
    }
    return false;
  }
}
