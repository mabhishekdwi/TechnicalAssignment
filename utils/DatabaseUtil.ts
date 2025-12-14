import mysql from 'mysql2/promise';
import pg from 'pg';

const { Pool: PgPool } = pg;

export type DatabaseType = 'mysql' | 'postgresql' | 'mongodb';

export interface DatabaseConfig {
  type: DatabaseType;
  host: string;
  port?: number;
  username?: string;
  password?: string;
  database: string;
  // MongoDB specific
  uri?: string;
}

export class DatabaseUtil {
  private config: DatabaseConfig | null = null;
  private mysqlConnection: mysql.Connection | null = null;
  private pgPool: pg.Pool | null = null;


  /**
   * Configure database connection
   * @param config - Database configuration
   */
  configure(config: DatabaseConfig): void {
    this.config = config;
  }

  /**
   * Connect to the database
   */
  async connect(): Promise<void> {
    if (!this.config) {
      throw new Error('Database not configured. Call configure() first.');
    }

    try {
      switch (this.config.type) {
        case 'mysql':
          await this.connectMySQL();
          break;
        case 'postgresql':
          await this.connectPostgreSQL();
          break;
        default:
          throw new Error(`Unsupported database type: ${this.config.type}`);
      }
      console.log(`Connected to ${this.config.type} database successfully`);
    } catch (error) {
      throw new Error(`Failed to connect to database: ${error}`);
    }
  }

  /**
   * Connect to MySQL database
   */
  private async connectMySQL(): Promise<void> {
    if (!this.config) return;

    this.mysqlConnection = await mysql.createConnection({
      host: this.config.host,
      port: this.config.port || 3306,
      user: this.config.username,
      password: this.config.password,
      database: this.config.database
    });
  }

  /**
   * Connect to PostgreSQL database
   */
  private async connectPostgreSQL(): Promise<void> {
    if (!this.config) return;

    this.pgPool = new PgPool({
      host: this.config.host,
      port: this.config.port || 5432,
      user: this.config.username,
      password: this.config.password,
      database: this.config.database
    });

    // Test the connection
    const client = await this.pgPool.connect();
    client.release();
  }

   /**
   * Execute a SQL query (MySQL or PostgreSQL)
   * @param query - SQL query string
   * @param params - Query parameters (optional)
   */
  async executeQuery<T = any>(query: string, params?: any[]): Promise<T[]> {
    if (!this.config) {
      throw new Error('Database not configured');
    }

    try {
      switch (this.config.type) {
        case 'mysql':
          return await this.executeMySQLQuery<T>(query, params);
        case 'postgresql':
          return await this.executePostgreSQLQuery<T>(query, params);
        default:
          throw new Error('executeQuery is only supported for MySQL and PostgreSQL');
      }
    } catch (error) {
      throw new Error(`Query execution failed: ${error}`);
    }
  }

  /**
   * Execute MySQL query
   */
  private async executeMySQLQuery<T>(query: string, params?: any[]): Promise<T[]> {
    if (!this.mysqlConnection) {
      throw new Error('MySQL connection not established');
    }

    const [rows] = await this.mysqlConnection.execute(query, params);
    return rows as T[];
  }

  /**
   * Execute PostgreSQL query
   */
  private async executePostgreSQLQuery<T>(query: string, params?: any[]): Promise<T[]> {
    if (!this.pgPool) {
      throw new Error('PostgreSQL connection not established');
    }

    const result = await this.pgPool.query(query, params);
    return result.rows as T[];
  }

  /**
   * Get a single record from database
   * @param query - SQL query string
   * @param params - Query parameters (optional)
   */
  async getOne<T = any>(query: string, params?: any[]): Promise<T | null> {
    const results = await this.executeQuery<T>(query, params);
    return results.length > 0 ? results[0] : null;
  }

}
// Export a singleton instance
export const dbUtil = new DatabaseUtil();
