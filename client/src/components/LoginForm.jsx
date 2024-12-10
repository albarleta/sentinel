//libraries
import { useNavigate } from "react-router";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

//context/zustand
import useAuthStore from "../store/useAuthStore.js";

//utils
import { login } from "../utils/apiAuth.js";

export default function LoginForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser, isLoading, setIsLoading } = useAuthStore();

  //form validation
  const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values) {
    setIsLoading(true);

    // Call the login function directly with the values
    login(values)
      .then((data) => {
        if (!data.accessToken || !data.refreshToken) {
          throw new Error("Invalid response from server");
        }

        setUser({
          name: data.name,
          email: data.email,
          role: data.role,
          _id: data._id,
        });

        // Save both tokens to localStorage
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.name}!`,
          className: "bg-green-300 text-gray-700",
          duration: 1000,
        });

        setTimeout(() => {
          navigate("/app/dashboard");
        }, 1000);
      })
      .catch((error) => {
        toast({
          title: "Login Failed",
          description: error.message || "Unable to log in. Please try again.",
          variant: "destructive",
        });
        console.error("Login error:", error.message);
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-[#82f4e5] text-gray-700 font-bold rounded-tl-3xl transition-colors w-full"
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </Form>
  );
}
