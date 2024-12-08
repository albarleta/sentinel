import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";

//components
import LoginForm from "../components/LoginForm";
import Loading from "../components/Loading.jsx";

//context(zustand)
import useAuthStore from "../store/useAuthStore.js";

export default function LoginPage() {
  const { isLoading } = useAuthStore();

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#4971bb]">
      {isLoading && <Loading />}
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-[#3a5c90]">Log in</CardTitle>
          <CardDescription>
            Track, access, and secure your documents with ease.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
