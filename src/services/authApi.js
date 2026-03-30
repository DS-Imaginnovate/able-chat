import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL;

const ACCESS_TOKEN_KEY = "fe_access_token";
const REFRESH_TOKEN_KEY = "fe_refresh_token";

export const authStorage = {
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  setTokens({ access_token, refresh_token }) {
    localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
  },
  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

export const authApi = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

authApi.interceptors.request.use((config) => {
  const token = authStorage.getAccessToken();
  const isAuthTokenRequest =
    config.url === "/api/authentication/user_access_token";

  if (token && !isAuthTokenRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function loginRequest(payload) {
  const response = await authApi.post(
    "/api/authentication/user_access_token",
    payload
  );
  return response.data;
}

export async function getMeRequest() {
  const response = await authApi.get("/api/v1/users/me");
  return response.data;
}

