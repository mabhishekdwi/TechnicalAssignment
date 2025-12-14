import * as dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: join(__dirname, '..', '.env') });

export type Environment = 'dev' | 'qa' | 'staging' | 'prod';

export interface EnvironmentConfig {
  name: Environment;
  baseURL: string;
  apiBaseURL: string;
  dbConfig?: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  };
  credentials?: {
    username: string;
    password: string;
    email: string;
  };
}

class EnvironmentManager {
  private currentEnv: Environment;
  private config: EnvironmentConfig;

  constructor() {
    this.currentEnv = (process.env.ENV as Environment) || 'dev';
    this.config = this.loadConfig();
  }

  /**
   * Load configuration based on current environment
   */
  private loadConfig(): EnvironmentConfig {
    const configs: Record<Environment, EnvironmentConfig> = {
      dev: {
        name: 'dev',
        baseURL: process.env.DEV_BASE_URL || 'https://dev.example.com',
        apiBaseURL: process.env.DEV_API_URL || 'https://dev-api.example.com',
        dbConfig: {
          host: process.env.DEV_DB_HOST || 'localhost',
          port: parseInt(process.env.DEV_DB_PORT || '3306'),
          database: process.env.DEV_DB_NAME || 'dev_db',
          username: process.env.DEV_DB_USER || 'root',
          password: process.env.DEV_DB_PASSWORD || ''
        },
        credentials: {
          username: process.env.DEV_USERNAME || 'testuser',
          password: process.env.DEV_PASSWORD || 'testpass',
          email: process.env.DEV_EMAIL || 'test@example.com'
        }
      },
      qa: {
        name: 'qa',
        baseURL: process.env.QA_BASE_URL || 'https://qa.example.com',
        apiBaseURL: process.env.QA_API_URL || 'https://qa-api.example.com',
        dbConfig: {
          host: process.env.QA_DB_HOST || 'qa-db.example.com',
          port: parseInt(process.env.QA_DB_PORT || '3306'),
          database: process.env.QA_DB_NAME || 'qa_db',
          username: process.env.QA_DB_USER || 'qa_user',
          password: process.env.QA_DB_PASSWORD || ''
        },
        credentials: {
          username: process.env.QA_USERNAME || 'qauser',
          password: process.env.QA_PASSWORD || 'qapass',
          email: process.env.QA_EMAIL || 'qa@example.com'
        }
      },
      staging: {
        name: 'staging',
        baseURL: process.env.STAGING_BASE_URL || 'https://staging.example.com',
        apiBaseURL: process.env.STAGING_API_URL || 'https://staging-api.example.com',
        dbConfig: {
          host: process.env.STAGING_DB_HOST || 'staging-db.example.com',
          port: parseInt(process.env.STAGING_DB_PORT || '3306'),
          database: process.env.STAGING_DB_NAME || 'staging_db',
          username: process.env.STAGING_DB_USER || 'staging_user',
          password: process.env.STAGING_DB_PASSWORD || ''
        },
        credentials: {
          username: process.env.STAGING_USERNAME || 'staginguser',
          password: process.env.STAGING_PASSWORD || 'stagingpass',
          email: process.env.STAGING_EMAIL || 'staging@example.com'
        }
      },
      prod: {
        name: 'prod',
        baseURL: process.env.PROD_BASE_URL || 'https://example.com',
        apiBaseURL: process.env.PROD_API_URL || 'https://api.example.com',
        dbConfig: {
          host: process.env.PROD_DB_HOST || 'prod-db.example.com',
          port: parseInt(process.env.PROD_DB_PORT || '3306'),
          database: process.env.PROD_DB_NAME || 'prod_db',
          username: process.env.PROD_DB_USER || 'prod_user',
          password: process.env.PROD_DB_PASSWORD || ''
        },
        credentials: {
          username: process.env.PROD_USERNAME || 'produser',
          password: process.env.PROD_PASSWORD || 'prodpass',
          email: process.env.PROD_EMAIL || 'prod@example.com'
        }
      }
    };

    return configs[this.currentEnv];
  }

  /**
   * Get current environment name
   */
  getEnvironment(): Environment {
    return this.currentEnv;
  }

  /**
   * Get full environment configuration
   */
  getConfig(): EnvironmentConfig {
    return this.config;
  }

  /**
   * Get base URL for current environment
   */
  getBaseURL(): string {
    return this.config.baseURL;
  }

  /**
   * Get API base URL for current environment
   */
  getApiBaseURL(): string {
    return this.config.apiBaseURL;
  }

  /**
   * Get database configuration for current environment
   */
  getDbConfig() {
    return this.config.dbConfig;
  }

  /**
   * Get credentials for current environment
   */
  getCredentials() {
    return this.config.credentials;
  }

  /**
   * Switch to a different environment
   * @param env - Environment to switch to
   */
  switchEnvironment(env: Environment): void {
    this.currentEnv = env;
    this.config = this.loadConfig();
    console.log(`Switched to ${env} environment`);
  }

  /**
   * Get environment variable
   * @param key - Environment variable key
   * @param defaultValue - Default value if not found
   */
  getEnvVar(key: string, defaultValue?: string): string {
    return process.env[key] || defaultValue || '';
  }

  /**
   * Check if running in CI environment
   */
  isCI(): boolean {
    return process.env.CI === 'true';
  }

  /**
   * Get timeout value based on environment
   */
  getTimeout(): number {
    return this.isCI() ? 60000 : 30000;
  }

  /**
   * Get retry count based on environment
   */
  getRetries(): number {
    return this.isCI() ? 2 : 0;
  }
}

// Export singleton instance
export const env = new EnvironmentManager();

// Export helper functions
export const getBaseURL = () => env.getBaseURL();
export const getApiBaseURL = () => env.getApiBaseURL();
export const getCredentials = () => env.getCredentials();
export const getDbConfig = () => env.getDbConfig();
export const isCI = () => env.isCI();
