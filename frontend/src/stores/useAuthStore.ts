import { create } from "zustand";
import api from "../lib/axios";
import { toast } from "sonner";

interface AuthStore {
  user: any | null;
  loading: boolean;
  refreshToken: string | null;
  fetchUser: () => Promise<void>;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false, 
  refreshToken: null,

  fetchUser: async () => {
    set({ loading: true })

   try {
     const res = await api.get('/user/', {withCredentials: true})
    set({
      user: res.data.user,
      loading: false,
    })
   } catch (error: any) {
     console.error("Failed to fetch user:", error.response?.data || error.message);
     set({
      user: null,
      loading: false
     })
   }
  },

  login: async (data) => {
    set({ loading: true });
    try {
      const res = await api.post("/auth/login", data, {
        withCredentials: true,
      });

     
      const refreshToken = res.data.refreshToken;

     
      localStorage.setItem('refreshToken', refreshToken)

      set({
        refreshToken: res.data.refreshToken,
        user: res.data.user || null,
      });

      toast.success("Logged in successfully!");
      window.location.href = "/booking";
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.response?.data?.message || "Login failed. Try again!");
      set({ refreshToken: null });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      set({
        user: null,
        refreshToken: null,
      });
      localStorage.removeItem('refreshToken')
      toast.success("Logged out successfully!");
      window.location.href = "/auth/login";
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed. Try again!");
    } finally {
      set({ loading: false });
    }
  },
}));

export default useAuthStore;
