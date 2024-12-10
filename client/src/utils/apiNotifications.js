import { apiRequest } from "./apiDefaults.js";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Function to handle search
export const getNotifications = async () => {
  const url = `${baseUrl}/notifications`;
  return apiRequest(url, "GET", undefined, true);
};

// Function to handle editing a document
export const updateNotification = async (id) => {
  const url = `${baseUrl}/notifications/${id}`;
  return apiRequest(url, "PATCH", undefined, true);
};
