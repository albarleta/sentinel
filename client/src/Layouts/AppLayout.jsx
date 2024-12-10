import { Outlet } from "react-router";
import Nav from "../components/Nav";
import { Toaster } from "@/components/ui/toaster";

//components
import Loading from "../components/Loading.jsx";

//context(zustand)
import useAuthStore from "../store/useAuthStore.js";

import { getUser } from "../utils/apiAuth.js";
import { useEffect } from "react";

function AppLayout() {
  const { user, setUser, isLoading } = useAuthStore();

  const fetchUser = () => {
    getUser()
      .then((user) => {
        setUser(user);
      })
      .catch((error) => console.error("Failed to get user:", error.message));
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      {isLoading && <Loading />}
      <div disabled={isLoading}>
        <Nav user={user} />
        <main className="h-screen pt-24 max-w-6xl m-auto">
          <Outlet />
        </main>
        <Toaster />
      </div>
    </div>
  );
}

export default AppLayout;
