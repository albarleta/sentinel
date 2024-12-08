import { Outlet } from "react-router";
import Nav from "../components/Nav";
import { Toaster } from "@/components/ui/toaster";

//components
import Loading from "../components/Loading.jsx";

//context(zustand)
import useAuthStore from "../store/useAuthStore.js";

function AppLayout() {
  const { isLoading } = useAuthStore();

  return (
    <div>
      {isLoading && <Loading />}
      <div disabled={isLoading}>
        <Nav />
        <main className="h-screen pt-24 max-w-6xl m-auto">
          <Outlet />
        </main>
        <Toaster />
      </div>
    </div>
  );
}

export default AppLayout;
