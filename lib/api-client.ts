type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: Record<string, unknown>;
  headers?: HeadersInit;
};

export class APIError<T = any> extends Error {
  public response: T;

  constructor(message: string, response: T) {
    super(message);
    this.name = this.constructor.name; // Set the error name to the class name
    this.response = response; // Add the custom response property
  }
}

interface APIClientOptions {
  baseURL?: string;
  getToken?: () => Promise<string | null>;
}

export class APIClient {
  private baseURL?: string;

  // function to get the token
  private getToken?: () => Promise<string | null>;

  constructor({ baseURL, getToken }: APIClientOptions = {}) {
    this.baseURL = baseURL || import.meta.env.VITE_API_BASE_URL;
    this.getToken = getToken;
  }

  async request(
    endpoint: string,
    { method = 'GET', body, headers = {} }: RequestOptions = {},
  ): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;

    const token = await this.getToken?.();

    const options: RequestInit = {
      method,
      headers: {
        'content-type': 'application/json',
        authorization: token ? `Bearer ${token}` : '',
        ...headers,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new APIError(
          data?.error ||
            data?.message ||
            'Something went wrong with the request',
          data,
        );
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  multipart(url: string, payload: any): Promise<any> {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
      method: 'POST',
      body: payload,
      headers: {
        'content-form': 'multipart/form-data',
      },
    });
  }

  get<T = any>(endpoint: string, headers?: HeadersInit): Promise<T> {
    return this.request(endpoint, { headers });
  }

  post<T = any>(
    endpoint: string,
    body?: any,
    headers?: HeadersInit,
  ): Promise<T> {
    return this.request(endpoint, { method: 'POST', body, headers });
  }

  patch<T = any>(
    endpoint: string,
    body?: any,
    headers?: HeadersInit,
  ): Promise<T> {
    return this.request(endpoint, { method: 'PATCH', body, headers });
  }

  put(
    endpoint: string,
    body: Record<string, unknown>,
    headers?: HeadersInit,
  ): Promise<any> {
    return this.request(endpoint, { method: 'PUT', body, headers });
  }

  delete(endpoint: string, headers?: HeadersInit): Promise<any> {
    return this.request(endpoint, { method: 'DELETE', headers });
  }
}
