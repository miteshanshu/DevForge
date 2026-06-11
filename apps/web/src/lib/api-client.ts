export const apiClient = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: { ...defaultHeaders, ...options.headers },
      credentials: 'include', // Send cookies cross-origin
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (err) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (errorData.errors && Array.isArray(errorData.errors)) {
        const validationErrors = errorData.errors.map((e: any) => e.message).join(', ');
        throw new Error(validationErrors || errorData.message || 'API request failed');
      }
      throw new Error(errorData.message || 'API request failed');
    }

    return response.json() as Promise<T>;
  },

  get<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, body: unknown, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
};
