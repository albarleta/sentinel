import { apiRequest } from "./apiDefaults.js";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Login
export const login = async (credentials) => {
  const url = `${baseUrl}/auth/login`;
  return apiRequest(url, "POST", credentials);
};

// Logout
export const logout = async () => {
  const url = `${baseUrl}/auth/logout`;
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    console.error("No refresh token found");
    return;
  }

  try {
    // Use apiRequest to make the POST request with refreshToken in the body
    const res = await apiRequest(url, "POST", { refreshToken });

    // If the response is successful, remove tokens from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    return await res; // Return the response (usually a success message or data)
  } catch (error) {
    console.error("Logout error:", error);
    throw error; // Propagate the error to be handled in the caller
  }
};

// Fetch Users
export const fetchUsers = async (query = "") => {
  const url = `${baseUrl}/auth/users`;
  const newUrl = new URL(url);
  if (query) {
    newUrl.searchParams.append("search", query);
  }

  return apiRequest(newUrl.toString(), "GET", null, true); // `true` means authorization is required
};

// Edit Account
export const editAccount = async (accountId, updatedData) => {
  const url = `${baseUrl}/auth/edit-account/${accountId}`;
  return apiRequest(url, "PUT", updatedData, true); // `true` means authorization is required
};

// Delete Account
export const deleteAccount = async (accountId) => {
  const url = `${baseUrl}/auth/delete/${accountId}`;
  return apiRequest(url, "DELETE", null, true); // `true` means authorization is required
};

// Create Account
export const createAccount = async (accountDetails) => {
  const url = `${baseUrl}/auth/create-account`;
  return apiRequest(url, "POST", accountDetails, true); // `true` means authorization is required
};

// Retrieve Reviewers Account
export const getReviewers = async () => {
  const url = `${baseUrl}/auth/reviewers`;
  return apiRequest(url, undefined, null, true); // `true` means authorization is required
};
