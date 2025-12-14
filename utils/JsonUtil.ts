import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class JsonUtil {
  /**
   * Load JSON data from a file
   * @param fileName - Name of the JSON file
   * @param relativePath - Optional relative path from project root (default: 'data')
   */
  loadJson<T = any>(fileName: string, relativePath: string = 'data'): T {
    try {
      const filePath = fileName.includes('/') || fileName.includes('\\')
        ? fileName
        : join(__dirname, '..', relativePath, fileName);

      if (!existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const fileContent = readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent) as T;
    } catch (error) {
      throw new Error(`Failed to load JSON file: ${error}`);
    }
  }

  /**
   * Write data to a JSON file
   * @param data - Data to write
   * @param fileName - Name of the JSON file
   * @param relativePath - Optional relative path from project root (default: 'data')
   * @param pretty - Format JSON with indentation (default: true)
   */
  writeJson(data: any, fileName: string, relativePath: string = 'data', pretty: boolean = true): void {
    try {
      const filePath = fileName.includes('/') || fileName.includes('\\')
        ? fileName
        : join(__dirname, '..', relativePath, fileName);

      const jsonContent = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
      writeFileSync(filePath, jsonContent, 'utf8');
      console.log(`JSON file written successfully: ${filePath}`);
    } catch (error) {
      throw new Error(`Failed to write JSON file: ${error}`);
    }
  }

  /**
   * Get a specific value from JSON using dot notation
   * @param data - JSON object
   * @param path - Dot notation path (e.g., 'user.credentials.username')
   */
  getValue(data: any, path: string): any {
    const keys = path.split('.');
    let result = data;

    for (const key of keys) {
      if (result === null || result === undefined) {
        return undefined;
      }
      result = result[key];
    }

    return result;
  }

  /**
   * Get test data by ID from a JSON array
   * @param fileName - Name of the JSON file
   * @param testId - Test case ID
   * @param idField - Field name for ID (default: 'id')
   * @param relativePath - Optional relative path (default: 'data')
   */
  getTestDataById<T = any>(
    fileName: string,
    testId: string | number,
    idField: string = 'id',
    relativePath: string = 'data'
  ): T | null {
    const data = this.loadJson<T[]>(fileName, relativePath);

    if (!Array.isArray(data)) {
      throw new Error('JSON file does not contain an array');
    }

    const testData = data.find((item: any) => item[idField] === testId);
    return testData ? (testData as T) : null;
  }

  /**
   * Filter test data based on a condition
   * @param fileName - Name of the JSON file
   * @param condition - Filter condition function
   * @param relativePath - Optional relative path (default: 'data')
   */
  filterTestData<T = any>(
    fileName: string,
    condition: (item: T) => boolean,
    relativePath: string = 'data'
  ): T[] {
    const data = this.loadJson<T[]>(fileName, relativePath);

    if (!Array.isArray(data)) {
      throw new Error('JSON file does not contain an array');
    }

    return data.filter(condition);
  }

  /**
   * Merge multiple JSON files
   * @param fileNames - Array of file names to merge
   * @param relativePath - Optional relative path (default: 'data')
   */
  mergeJsonFiles<T = any>(fileNames: string[], relativePath: string = 'data'): T {
    const mergedData: any = {};

    for (const fileName of fileNames) {
      const data = this.loadJson(fileName, relativePath);
      Object.assign(mergedData, data);
    }

    return mergedData as T;
  }

  /**
   * Validate JSON against a schema (basic validation)
   * @param data - JSON data to validate
   * @param requiredFields - Array of required field names
   */
  validateJson(data: any, requiredFields: string[]): { valid: boolean; missingFields: string[] } {
    const missingFields: string[] = [];

    for (const field of requiredFields) {
      if (this.getValue(data, field) === undefined) {
        missingFields.push(field);
      }
    }

    return {
      valid: missingFields.length === 0,
      missingFields
    };
  }
}

// Export a singleton instance
export const jsonUtil = new JsonUtil();
