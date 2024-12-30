import { useAuthStore } from "@/stores/authStore";
// import MyUtils from "./Myutils";

export default class MyHttpService {
  static API_BASE_URL = "http://localhost:5000/api"; // Replace with your backend URL

  static loadImage(imageUrl){
    return `http://localhost:3000/Uploads/${imageUrl}`
  }
  /**
   * Delays the request execution by the specified milliseconds.
   * @param {number} ms - Milliseconds to delay.
   * @returns {Promise<void>} - Resolves after the delay.
   */
  static delay(ms = 0) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Prepares query parameters for the URL.
   * @param {object} params - Query parameters as key-value pairs.
   * @returns {string} - Encoded query string.
   */
  static prepareQuery(params = {}) {
    const query = new URLSearchParams(params).toString();
    return query ? `?${query}` : "";
  }

  /**
   * Makes an HTTP request.
   * @param {string} method - HTTP method (GET, POST, PUT, DELETE).
   * @param {string} endpoint - API endpoint.
   * @param {object} query - Query parameters as key-value pairs.
   * @param {object} body - Request body (for POST/PUT).
   * @param {boolean} useJWT - Whether to include the JWT in the request headers.
   * @param {number} delay - Delay in milliseconds before sending the request.
   * @returns {Promise<object|string>} - JSON response or error message.
   */
  static async request(
    method,
    endpoint,
    { query = {}, body = null, useJWT = false, delay = 0 } = {}
  ) {
    // Delay the request if specified
    await this.delay(delay);

    // Prepare query parameters
    const queryString = this.prepareQuery(query);

    // Set headers
    const headers = { "Content-Type": "application/json" };

    // Attach JWT if needed
    if (useJWT) {
      const jwt = localStorage.getItem("jwt");
      if (jwt) {
        headers.Authorization = `Bearer ${jwt}`;
      }
    }

    try {

      console.log(`Request sentt ${this.API_BASE_URL}${endpoint}${queryString}`)
      // Make the fetch request
      const response = await fetch(`${this.API_BASE_URL}${endpoint}${queryString}`, {
        method: method,
        headers: headers,
        body: body ? JSON.stringify(body) : null,
      });

      // Handle different response statuses
      if (response.status === 410) {
        // JWT expired or invalid
        const authStore = useAuthStore();
        // MyUtils.showToast("Session expired. Please log in again.", "error");
        authStore.logout(); // Automatically log out the user
        return { error: "Session expired. Please log in again." };
      }

      if (response.status === 400) {
        const data = await response.json();
        return { error: data.message || "Bad Request" };
      }

      if (response.status === 500) {
        return { error: "Server Internal Error" };
      }

      // Parse and return JSON for successful responses
      if (response.ok) {
        return response.json();
      }

      // Handle unexpected statuses
      return { error: `Unexpected Error: ${response.status}` };
    } catch (error) {
      // Handle network errors or other issues
      console.log(error.message);
      return { error: "Unknowen Error Occured" };
    }
  }

  /**
   * Convenience method for GET requests.
   * @param {string} endpoint - API endpoint.
   * @param {object} query - Query parameters as key-value pairs.
   * @param {boolean} useJWT - Whether to include the JWT in the request headers.
   * @param {number} delay - Delay in milliseconds before sending the request.
   * @returns {Promise<object|string>} - JSON response or error message.
   */
  static get(endpoint, { query = {}, useJWT = false, delay = 0 } = {}) {
    return this.request("GET", endpoint, { query, useJWT, delay });
  }

  /**
   * Convenience method for POST requests.
   * @param {string} endpoint - API endpoint.
   * @param {object} body - Request body (for POST).
   * @param {boolean} useJWT - Whether to include the JWT in the request headers.
   * @param {number} delay - Delay in milliseconds before sending the request.
   * @returns {Promise<object|string>} - JSON response or error message.
   */
  static post(endpoint, { body = {}, useJWT = false, delay = 0 } = {}) {
    return this.request("POST", endpoint, { body, useJWT, delay });
  }

  /**
   * Convenience method for PUT requests.
   * @param {string} endpoint - API endpoint.
   * @param {object} body - Request body (for PUT).
   * @param {boolean} useJWT - Whether to include the JWT in the request headers.
   * @param {number} delay - Delay in milliseconds before sending the request.
   * @returns {Promise<object|string>} - JSON response or error message.
   */
  static patch(endpoint, { body = {}, useJWT = false, delay = 0 } = {}) {
    return this.request("PATCH", endpoint, { body, useJWT, delay });
  }

  /**
   * Convenience method for DELETE requests.
   * @param {string} endpoint - API endpoint.
   * @param {boolean} useJWT - Whether to include the JWT in the request headers.
   * @param {number} delay - Delay in milliseconds before sending the request.
   * @returns {Promise<object|string>} - JSON response or error message.
   */
  static delete(endpoint, { useJWT = false, delay = 0 } = {}) {
    return this.request("DELETE", endpoint, { useJWT, delay });
  }
}
