import * as XLSX from 'xlsx';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class ExcelUtil {
  private workbook: XLSX.WorkBook | null = null;
  private filePath: string = '';

  /**
   * Load an Excel file
   * @param fileName - Name of the Excel file (with or without path)
   * @param relativePath - Optional relative path from project root (default: 'data')
   */
  loadFile(fileName: string, relativePath: string = 'data'): void {
    try {
      this.filePath = fileName.includes('/') || fileName.includes('\\')
        ? fileName
        : join(__dirname, '..', relativePath, fileName);

      this.workbook = XLSX.readFile(this.filePath);
      console.log(`Excel file loaded successfully: ${this.filePath}`);
    } catch (error) {
      throw new Error(`Failed to load Excel file: ${error}`);
    }
  }

  /**
   * Get all sheet names from the workbook
   */
  getSheetNames(): string[] {
    if (!this.workbook) {
      throw new Error('No workbook loaded. Please call loadFile() first.');
    }
    return this.workbook.SheetNames;
  }

  /**
   * Get data from a specific sheet as an array of objects
   * @param sheetName - Name of the sheet (default: first sheet)
   */
  getSheetData<T = any>(sheetName?: string): T[] {
    if (!this.workbook) {
      throw new Error('No workbook loaded. Please call loadFile() first.');
    }

    const sheet = sheetName
      ? this.workbook.Sheets[sheetName]
      : this.workbook.Sheets[this.workbook.SheetNames[0]];

    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found in workbook.`);
    }

    return XLSX.utils.sheet_to_json<T>(sheet);
  }

  /**
   * Get data from a specific sheet as a 2D array
   * @param sheetName - Name of the sheet (default: first sheet)
   */
  getSheetDataAsArray(sheetName?: string): any[][] {
    if (!this.workbook) {
      throw new Error('No workbook loaded. Please call loadFile() first.');
    }

    const sheet = sheetName
      ? this.workbook.Sheets[sheetName]
      : this.workbook.Sheets[this.workbook.SheetNames[0]];

    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found in workbook.`);
    }

    return XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });
  }

  /**
   * Get a specific row from a sheet
   * @param rowIndex - Zero-based row index
   * @param sheetName - Name of the sheet (default: first sheet)
   */
  getRow<T = any>(rowIndex: number, sheetName?: string): T {
    const data = this.getSheetData<T>(sheetName);
    if (rowIndex >= data.length) {
      throw new Error(`Row index ${rowIndex} is out of bounds. Sheet has ${data.length} rows.`);
    }
    return data[rowIndex];
  }

  /**
   * Get a specific cell value
   * @param cellAddress - Cell address in A1 notation (e.g., 'A1', 'B2')
   * @param sheetName - Name of the sheet (default: first sheet)
   */
  getCellValue(cellAddress: string, sheetName?: string): any {
    if (!this.workbook) {
      throw new Error('No workbook loaded. Please call loadFile() first.');
    }

    const sheet = sheetName
      ? this.workbook.Sheets[sheetName]
      : this.workbook.Sheets[this.workbook.SheetNames[0]];

    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found in workbook.`);
    }

    const cell = sheet[cellAddress];
    return cell ? cell.v : null;
  }

  /**
   * Filter data based on a column value
   * @param columnName - Name of the column to filter
   * @param value - Value to match
   * @param sheetName - Name of the sheet (default: first sheet)
   */
  filterByColumn<T = any>(columnName: string, value: any, sheetName?: string): T[] {
    const data = this.getSheetData<T>(sheetName);
    return data.filter((row: any) => row[columnName] === value);
  }

  /**
   * Get data for a specific test case
   * @param testCaseId - Test case identifier
   * @param idColumn - Column name containing test case IDs (default: 'TestCaseID')
   * @param sheetName - Name of the sheet (default: first sheet)
   */
  getTestData<T = any>(testCaseId: string | number, idColumn: string = 'TestCaseID', sheetName?: string): T | null {
    const data = this.filterByColumn<T>(idColumn, testCaseId, sheetName);
    return data.length > 0 ? data[0] : null;
  }

  /**
   * Get all test data where a specific column matches a condition
   * @param columnName - Column name to check
   * @param condition - Condition function
   * @param sheetName - Name of the sheet (default: first sheet)
   */
  getTestDataByCondition<T = any>(
    columnName: string,
    condition: (value: any) => boolean,
    sheetName?: string
  ): T[] {
    const data = this.getSheetData<T>(sheetName);
    return data.filter((row: any) => condition(row[columnName]));
  }

  /**
   * Write data to a new Excel file
   * @param data - Array of objects to write
   * @param fileName - Output file name
   * @param sheetName - Sheet name (default: 'Sheet1')
   */
  writeToExcel(data: any[], fileName: string, sheetName: string = 'Sheet1'): void {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const newWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWorkbook, worksheet, sheetName);

      const outputPath = fileName.includes('/') || fileName.includes('\\')
        ? fileName
        : join(__dirname, '..', 'data', fileName);

      XLSX.writeFile(newWorkbook, outputPath);
      console.log(`Excel file written successfully: ${outputPath}`);
    } catch (error) {
      throw new Error(`Failed to write Excel file: ${error}`);
    }
  }
}

// Export a singleton instance
export const excelUtil = new ExcelUtil();
