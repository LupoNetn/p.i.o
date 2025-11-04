import axios from "axios";

//"https://pioo.onrender.com/api"
//"http://localhost:8080/api"
const api = axios.create({
  baseURL: "https://pioo.onrender.com/api",
  withCredentials: true, // always send cookies
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 1️⃣ Try refresh using HTTP-only cookie
        await api.post("/auth/refresh");

        // 2️⃣ If refresh worked, retry the original request
        return api(originalRequest);
      } catch (err) {
        console.warn("Cookie-based refresh failed, trying localStorage fallback");

        // 3️⃣ If that failed, fallback to localStorage (optional)
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          try {
            await api.post("/auth/refresh", { refreshToken });
            return api(originalRequest);
          } catch (err2) {
            console.error("Both refresh attempts failed");
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
