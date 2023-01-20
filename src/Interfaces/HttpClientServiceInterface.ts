export interface HttpClientServiceInterface {
    /**
     * Send a GET request
     * @param url 
     */
    getRequestAsync<T>(url: string): Promise<T>;
}