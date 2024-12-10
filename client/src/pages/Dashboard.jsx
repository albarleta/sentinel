import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import useAuthStore from "../store/useAuthStore.js";

//components
import SystemAdminPage from "../pages/SystemAdminPage";
import ManagerPage from "../pages/ManagerPage";
import ReviewerPage from "../pages/ReviewerPage";
import Loading from "../components/Loading.jsx";

import { getUser } from "../utils/apiAuth.js";

export default function Dashboard() {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = () => {
    getUser()
      .then((user) => {
        setUser(user);
        setIsLoading(false);
      })
      .catch((error) => console.error("Failed to get user:", error.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/app/login" replace />;
  }

  switch (user.role) {
    case "SystemAdmin":
      return <SystemAdminPage />;
    case "Manager":
      return <ManagerPage />;
    case "Reviewer":
      return <ReviewerPage />;
    default:
      return <Navigate to="/not-authorized" replace />;
  }
}
