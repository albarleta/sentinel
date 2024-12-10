import { Button } from "@/components/ui/button";
import { IoPersonAdd } from "react-icons/io5";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

import SearchDropdown from "./SearchDropdown";
import { useState } from "react";

import { createAccount } from "../utils/apiAuth";

// Zod validation schema
const accountSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Password must include uppercase, lowercase, number, and special character",
      }
    ),
  role: z.enum(["Manager", "Reviewer"], {
    required_error: "Role is required",
  }),
});

export default function AddAccountForm({ getUsers, isLoading, setIsLoading }) {
  // New state to manage dialog open/close
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Zod validation for form
  const form = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: undefined,
    },
  });

  const handleCreateAccount = (data) => {
    setIsLoading(true);
    createAccount(data) // Use createAccount to add a new user
      .then(() => {
        getUsers(); // Refresh the user list after adding the account
        toast({
          title: "Account Ceated!",
          description: "The new account has been successfully added.",
          className: "bg-[#82F4E5] text-gray-700",
          duration: 2000,
        });

        // Close the dialog and reset the form
        setIsDialogOpen(false);
        form.reset();
      })
      .catch((error) => {
        console.error("Error adding account:", error);
        toast({
          title: "Failed to Create Account!",
          description:
            error.message || "An error occurred while adding the account.",
          variant: "destructive",
          duration: 2000,
        });
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      });
  };

  // Reset form when the dialog is opened
  const handleDialogOpenChange = (open) => {
    if (open) {
      form.reset(); // Reset the form when the dialog is opened
    }
    setIsDialogOpen(open);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <IoPersonAdd className="text-[#3a5c90] mr-2" />
          Add account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-[#3a5c90]">Add new account</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateAccount)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                    />
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
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <div>
                      <SearchDropdown
                        placeholder="Select Role"
                        data={[{ role: "Manager" }, { role: "Reviewer" }]}
                        onSubmit={(selectedRole) => {
                          form.setValue("role", selectedRole.role, {
                            shouldValidate: true,
                          });
                        }}
                        searchFields={["role"]}
                        mainParameter="role"
                        subParameter="email"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-[#82f4e5]  text-gray-700 font-bold rounded-tl-3xl transition-colors w-full"
              >
                {isLoading ? (
                  <>
                    Creating Account
                    <Loader2 className="animate-spin" />
                  </>
                ) : (
                  "Add Account"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
