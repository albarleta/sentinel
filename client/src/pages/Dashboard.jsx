import { Navigate } from "react-router";
import useAuthStore from "../store/useAuthStore.js";
import SystemAdminPage from "../pages/SystemAdminPage";
import ManagerPage from "../pages/ManagerPage";
import ReviewerPage from "../pages/ReviewerPage";

export default function Dashboard() {
  const { user } = useAuthStore();

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
