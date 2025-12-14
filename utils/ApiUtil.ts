import { request, APIRequestContext, APIResponse } from '@playwright/test';

export interface ApiConfig {
  baseURL: string;
  headers?: Record<string, string>;
  timeout?: number;
  ignoreHTTPSErrors?: boolean;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
}

export class ApiUtil {
  private context: APIRequestContext | null = null;
  private baseURL: string = '';
  private defaultHeaders: Record<string, string> = {};
  private timeout: number = 30000;

  /**
   * Initialize API context
   * @param config - API configuration
   */
  async init(config: ApiConfig): Promise<void> {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout || 30000;

    // Minimal headers to avoid triggering CloudFlare/WAF
    // Mimic curl's behavior for better compatibility
    const headers: Record<string, string> = {
      'Accept': '*/*',
      ...this.defaultHeaders
    };

    if (config.headers) {
      Object.assign(headers, config.headers);
    }

    this.context = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: headers,
      timeout: this.timeout,
      ignoreHTTPSErrors: config.ignoreHTTPSErrors ?? true,
      // Don't send browser-like headers
      userAgent: ''
    });

    console.log(`API context initialized with baseURL: ${this.baseURL}`);
  }

  /**
   * Set authorization header
   * @param token - Bearer token
   */
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    if (this.context) {
      // Need to reinitialize context with new headers
      this.context.dispose();
      this.init({ baseURL: this.baseURL, headers: this.defaultHeaders, timeout: this.timeout });
    }
  }

  /**
   * Set custom header
   * @param key - Header key
   * @param value - Header value
   */
  setHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  /**
   * Remove a header
   * @param key - Header key to remove
   */
  removeHeader(key: string): void {
    delete this.defaultHeaders[key];
  }

  /**
   * Build query string from params
   */
  private buildQueryString(params?: Record<string, any>): string {
    if (!params) return '';
    const queryString = new URLSearchParams(params).toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * GET request
   * @param endpoint - API endpoint
   * @param options - Request options
   */
  async get(endpoint: string, options: RequestOptions = {}): Promise<APIResponse> {
    if (!this.context) {
      throw new Error('API context not initialized. Call init() first.');
    }

    const url = endpoint + this.buildQueryString(options.params);
    console.log(`GET Request: ${url}`);

    const response = await this.context.get(url, {
      headers: options.headers,
      timeout: options.timeout
    });

    await this.logResponse(response);
    return response;
  }

  /**
   * POST request
   * @param endpoint - API endpoint
   * @param options - Request options
   */
  async post(endpoint: string, options: RequestOptions = {}): Promise<APIResponse> {
    if (!this.context) {
      throw new Error('API context not initialized. Call init() first.');
    }

    const url = endpoint + this.buildQueryString(options.params);
    console.log(`POST Request: ${url}`);

    // Prepare headers and data
    const headers = { ...options.headers };
    let data = options.data;

    // If data is URLSearchParams, convert to string and set Content-Type
    if (data instanceof URLSearchParams) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      data = data.toString();
      console.log(`Request Body (form):`, data);
    } else if (data) {
      console.log(`Request Body (JSON):`, JSON.stringify(data, null, 2));
    }

    const response = await this.context.post(url, {
      headers,
      data,
      timeout: options.timeout
    });

    await this.logResponse(response);
    return response;
  }

  /**
   * PUT request
   * @param endpoint - API endpoint
   * @param options - Request options
   */
  async put(endpoint: string, options: RequestOptions = {}): Promise<APIResponse> {
    if (!this.context) {
      throw new Error('API context not initialized. Call init() first.');
    }

    const url = endpoint + this.buildQueryString(options.params);
    console.log(`PUT Request: ${url}`);

    // Prepare headers and data
    const headers = { ...options.headers };
    let data = options.data;

    // If data is URLSearchParams, convert to string and set Content-Type
    if (data instanceof URLSearchParams) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      data = data.toString();
      console.log(`Request Body (form):`, data);
    } else if (data) {
      console.log(`Request Body (JSON):`, JSON.stringify(data, null, 2));
    }

    const response = await this.context.put(url, {
      headers,
      data,
      timeout: options.timeout
    });

    await this.logResponse(response);
    return response;
  }

  /**
   * PATCH request
   * @param endpoint - API endpoint
   * @param options - Request options
   */
  async patch(endpoint: string, options: RequestOptions = {}): Promise<APIResponse> {
    if (!this.context) {
      throw new Error('API context not initialized. Call init() first.');
    }

    const url = endpoint + this.buildQueryString(options.params);
    console.log(`PATCH Request: ${url}`);

    // Prepare headers and data
    const headers = { ...options.headers };
    let data = options.data;

    // If data is URLSearchParams, convert to string and set Content-Type
    if (data instanceof URLSearchParams) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      data = data.toString();
      console.log(`Request Body (form):`, data);
    } else if (data) {
      console.log(`Request Body (JSON):`, JSON.stringify(data, null, 2));
    }

    const response = await this.context.patch(url, {
      headers,
      data,
      timeout: options.timeout
    });

    await this.logResponse(response);
    return response;
  }

  /**
   * DELETE request
   * @param endpoint - API endpoint
   * @param options - Request options
   */
  async delete(endpoint: string, options: RequestOptions = {}): Promise<APIResponse> {
    if (!this.context) {
      throw new Error('API context not initialized. Call init() first.');
    }

    const url = endpoint + this.buildQueryString(options.params);
    console.log(`DELETE Request: ${url}`);

    // Prepare headers and data
    const headers = { ...options.headers };
    let data = options.data;

    // If data is URLSearchParams, convert to string and set Content-Type
    if (data instanceof URLSearchParams) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      data = data.toString();
      console.log(`Request Body (form):`, data);
    } else if (data) {
      console.log(`Request Body:`, JSON.stringify(data, null, 2));
    }

    const response = await this.context.delete(url, {
      headers,
      data,
      timeout: options.timeout
    });

    await this.logResponse(response);
    return response;
  }

  /**
   * HEAD request
   * @param endpoint - API endpoint
   * @param options - Request options
   */
  async head(endpoint: string, options: RequestOptions = {}): Promise<APIResponse> {
    if (!this.context) {
      throw new Error('API context not initialized. Call init() first.');
    }

    const url = endpoint + this.buildQueryString(options.params);
    console.log(`HEAD Request: ${url}`);

    const response = await this.context.head(url, {
      headers: options.headers,
      timeout: options.timeout
    });

    await this.logResponse(response);
    return response;
  }

  /**
   * Get response body as JSON
   * @param response - API response
   */
  async getJson<T = any>(response: APIResponse): Promise<T> {
    const text = await response.text();

    try {
      // Check if response is HTML
      if (text.trim().startsWith('<')) {
        console.error('Response is HTML, not JSON:');
        console.error(text.substring(0, 500)); // Show first 500 chars
        throw new Error(`Expected JSON but received HTML. Status: ${response.status()}. URL: ${response.url()}\nCheck if the API endpoint is correct.`);
      }

      return JSON.parse(text) as T;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Failed to parse JSON response. Status: ${response.status()}\nResponse preview: ${text.substring(0, 200)}`);
      }
      throw error;
    }
  }

  /**
   * Get response body as text
   * @param response - API response
   */
  async getText(response: APIResponse): Promise<string> {
    try {
      return await response.text();
    } catch (error) {
      throw new Error(`Failed to get text response: ${error}`);
    }
  }

  /**
   * Verify response status
   * @param response - API response
   * @param expectedStatus - Expected status code
   */
  verifyStatus(response: APIResponse, expectedStatus: number): boolean {
    const actualStatus = response.status();
    console.log(`Expected Status: ${expectedStatus}, Actual Status: ${actualStatus}`);
    return actualStatus === expectedStatus;
  }

  /**
   * Verify response status is OK (200-299)
   * @param response - API response
   */
  verifyOk(response: APIResponse): boolean {
    return response.ok();
  }

  /**
   * Log response details (without consuming the body)
   */
  private async logResponse(response: APIResponse): Promise<void> {
    console.log(`Response Status: ${response.status()} ${response.statusText()}`);
    console.log(`Response URL: ${response.url()}`);
    console.log(`Response Headers:`, JSON.stringify(response.headers(), null, 2));
    // Note: We don't log the body here as it would consume the response
    // Use getJson() or getText() in your tests to read and log the body
  }

  /**
   * Dispose API context
   */
  async dispose(): Promise<void> {
    if (this.context) {
      await this.context.dispose();
      this.context = null;
      console.log('API context disposed');
    }
  }

  /**
   * Upload file
   * @param endpoint - API endpoint
   * @param filePath - Path to file
   * @param fieldName - Form field name (default: 'file')
   * @param options - Additional options
   */
  async uploadFile(
    endpoint: string,
    filePath: string,
    fieldName: string = 'file',
    options: RequestOptions = {}
  ): Promise<APIResponse> {
    if (!this.context) {
      throw new Error('API context not initialized. Call init() first.');
    }

    console.log(`POST File Upload: ${endpoint}`);

    const response = await this.context.post(endpoint, {
      headers: options.headers,
      multipart: {
        [fieldName]: {
          name: filePath.split('/').pop() || 'file',
          mimeType: 'application/octet-stream',
          buffer: Buffer.from(filePath) // You may need to read the actual file
        },
        ...options.data
      },
      timeout: options.timeout
    });

    await this.logResponse(response);
    return response;
  }
}

// Export a singleton instance
export const apiUtil = new ApiUtil();
