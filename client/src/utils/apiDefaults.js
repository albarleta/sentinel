const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Function to handle token refresh
const refreshAccessToken = async () => {
  try {
    let refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      console.error("No refresh token found");
      return null;
    }

    const res = await fetch(`${baseUrl}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message);
    }

    const data = await res.json();
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

// Generalized API request handler (for login, logout, users, etc.)
export const apiRequest = async (
  url,
  method = "GET",
  body,
  requiresAuth = false,
  json = true
) => {
  let accessToken = requiresAuth ? localStorage.getItem("accessToken") : " ";

  // If authorization is required and no access token exists, throw error
  // if (requiresAuth && !accessToken) {
  //   console.error("No access token found");
  //   return;
  // }

  let config = {
    method,
    headers: {
      ...(json ? { "Content-Type": "application/json" } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: json ? (body ? JSON.stringify(body) : null) : body,
  };

  try {
    let res = await fetch(url, config);

    if (!res.ok) {
      if (res.status === 401) {
        console.warn("Access token expired. Attempting to refresh token...");

        // Refresh token logic
        const newToken = await refreshAccessToken();
        if (!newToken) {
          throw new Error("Unable to refresh token");
        }

        // Retry the request with the new token
        config.headers.Authorization = `Bearer ${newToken}`;
        res = await fetch(url, config);
      }

      const errorData = await res.json();
      throw new Error(errorData.message);
    }

    return await res.json();
  } catch (error) {
    console.error("API Request error:", error);
    throw error;
  }
};
