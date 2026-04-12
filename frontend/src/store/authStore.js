import { create } from "zustand";
import axios from "axios";

export const useAuth = create((set) => ({
  currentUser: null,
  loading: false,
  isAuthenticated: false,
  error: null,

  login: async (userCredWithRole) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/auth/login", userCredWithRole, {
        withCredentials: true,
      });
      set({
        loading: false,
        isAuthenticated: true,
        currentUser: res.data.payload,
        error: null,
      });
      return res.data;
    } catch (err) {
      console.log("err is ", err);
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.message || "Login failed",
      });
      throw err;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await axios.get("/auth/logout", { withCredentials: true });
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: null,
      });
    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.message || "Logout failed",
      });
    }
  },

  // Restore login session on page refresh by verifying the httpOnly cookie
  checkAuth: async () => {
    try {
      set({ loading: true });
      const res = await axios.get("/auth/check-auth", { withCredentials: true });
      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err) {
      // If user is not logged in → silently clear state
      if (err.response?.status === 401) {
        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
        });
        return;
      }
      // other errors
      console.error("Auth check failed:", err);
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
