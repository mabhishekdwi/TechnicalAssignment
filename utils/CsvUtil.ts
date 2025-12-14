import * as fs from 'fs';
import * as path from 'path';

/**
 * CSV Utility for reading test data from CSV files
 */
export class CsvUtil {
  private filePath: string = '';
  private data: any[] = [];

  /**
   * Load CSV file from data folder
   * @param fileName CSV file name (e.g., 'users.csv')
   * @param relativePath Relative path from project root (default: 'data')
   */
  loadFile(fileName: string, relativePath: string = 'data'): void {
    this.filePath = path.join(process.cwd(), relativePath, fileName);

    if (!fs.existsSync(this.filePath)) {
      throw new Error(`CSV file not found: ${this.filePath}`);
    }

    const fileContent = fs.readFileSync(this.filePath, 'utf-8');
    this.data = this.parseCSV(fileContent);
  }

  /**
   * Parse CSV content to array of objects
   * @param csvContent Raw CSV file content
   * @returns Array of objects with headers as keys
   */
  private parseCSV(csvContent: string): any[] {
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');

    if (lines.length === 0) {
      return [];
    }

    // First line is headers
    const headers = lines[0].split(',').map(h => h.trim());
    const data: any[] = [];

    // Parse each data row
    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);

      if (values.length === headers.length) {
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = this.parseValue(values[index].trim());
        });
        data.push(row);
      }
    }

    return data;
  }

  /**
   * Parse a single CSV line handling quoted values
   * @param line CSV line to parse
   * @returns Array of values
   */
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current);
    return result;
  }

  /**
   * Parse value to appropriate type (string, boolean)
   * @param value String value to parse
   * @returns Parsed value
   */
  private parseValue(value: string): any {
    if (!value || value === '') {
      return '';
    }

    // Remove surrounding quotes if present
    const trimmedValue = value.replace(/^["']|["']$/g, '').trim();

    // Check for boolean
    if (trimmedValue.toLowerCase() === 'true') return true;
    if (trimmedValue.toLowerCase() === 'false') return false;

    // Keep all other values as strings (including numbers)
    // This ensures compatibility with Playwright's selectOption which expects strings
    return trimmedValue;
  }

  /**
   * Get all data from CSV
   * @returns Array of all rows as objects
   */
  getAllData<T>(): T[] {
    return this.data as T[];
  }

  /**
   * Get specific row by index
   * @param index Row index (0-based)
   * @returns Row data as object
   */
  getRow<T>(index: number): T | null {
    if (index >= 0 && index < this.data.length) {
      return this.data[index] as T;
    }
    return null;
  }

  /**
   * Get row by matching column value
   * @param columnName Column name to search
   * @param value Value to match
   * @returns First matching row or null
   */
  getRowByColumn<T>(columnName: string, value: any): T | null {
    const row = this.data.find(row => row[columnName] === value);
    return row ? (row as T) : null;
  }

  /**
   * Filter rows by column value
   * @param columnName Column name to filter
   * @param value Value to match
   * @returns Array of matching rows
   */
  filterByColumn<T>(columnName: string, value: any): T[] {
    return this.data.filter(row => row[columnName] === value) as T[];
  }

  /**
   * Get random row from CSV data
   * @returns Random row as object
   */
  getRandomRow<T>(): T | null {
    if (this.data.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * this.data.length);
    return this.data[randomIndex] as T;
  }

  /**
   * Get number of rows in CSV (excluding header)
   * @returns Number of data rows
   */
  getRowCount(): number {
    return this.data.length;
  }

  /**
   * Check if CSV file is loaded and has data
   * @returns True if data is available
   */
  hasData(): boolean {
    return this.data.length > 0;
  }
}
