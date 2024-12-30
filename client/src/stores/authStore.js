import { defineStore } from "pinia";
import {jwtDecode} from "jwt-decode";
import MyHttpService from "@/stores/MyHttpService"; // Ensure this points to your MyHttpService configuration

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("accessToken") || null,
    isLoading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => {
      if (state.token) {
        return jwtDecode(state.token)?.user || null;
      }
      return null;
    },
    getError: (state) => state.error,
    userRole: (state) => {
      if (state.token) {
        return jwtDecode(state.token)?.user?.is_admin || null;
      }
      return null;
    },
  },

  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem("accessToken", token);
    },

    clearToken() {
      this.token = null;
      localStorage.removeItem("accessToken");
    },

    isTokenValid() {
      if (!this.token) return false;

      const { exp } = jwtDecode(this.token);
      return exp * 1000 > Date.now();
    },

    async login(credentials) {
      this.isLoading = true;
      this.error = null;
  
      try {
        const response = await MyHttpService.post("/login", { body: credentials });
       

        if (response.error) {
          throw new Error(response.error);
        }

        console.log("Login response:", response.accessToken)
        this.setToken(response.accessToken);
        this.user = jwtDecode(this.token);
        return true;
      } catch (error) {
        console.error("Login error:", error);
        this.error = error.response?.message || "Login failed";
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    async register(userData) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await MyHttpService.post("/register", userData);

        // Optionally, automatically log the user in after registration
        if (response.data.accessToken) {
          this.setToken(response.data.accessToken);
          this.user = jwtDecode(this.token);
        }
        return true;
      } catch (error) {
        console.error("Registration error:", error);
        this.error = error.response?.data?.message || "Registration failed";
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    logout() {
      this.clearToken();
      this.user = null;
    },
  },
});
