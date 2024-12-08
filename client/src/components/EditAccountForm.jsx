import { Button } from "@/components/ui/button";
import { FaUserEdit } from "react-icons/fa";
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
import SearchDropdown from "./SearchDropdown";
import { useState } from "react";

import { editAccount } from "../utils/apiAuth";

// Zod validation schema
const accountSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  role: z.enum(["Manager", "Reviewer"], {
    required_error: "Role is required",
  }),
  status: z.enum(["Active", "Inactive"], {
    required_error: "Status is required",
  }),
});

export default function EditAccountForm({
  getUsers,
  data,
  isLoading,
  setIsLoading,
}) {
  // New state to manage dialog open/close
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Zod validation for form
  const form = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
    },
  });

  const handleEditAccount = async (updatedData) => {
    setIsLoading(true);
    editAccount(data._id, updatedData) // Use editAccount to edit a user profile
      .then(() => {
        getUsers(); // Refresh the user list after editing the account
        toast({
          title: "Account Edited!",
          description: "The account has been successfully edited.",
          className: "bg-green-300 text-gray-700",
          duration: 2000,
        });

        // Close the dialog and reset the form
        setTimeout(() => {
          setIsDialogOpen(false);
          form.reset();
        }, 2000);
      })
      .catch((error) => {
        console.error("Error editing account:", error);
        toast({
          title: "Failed to Edit Account!",
          description:
            error.message || "An error occurred while editing the account.",
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
        <Button
          variant="outline"
          className="border-slate-500 text-black hover:bg-slate-100 w-full"
        >
          <FaUserEdit className="text-[#3a5c90] mr-2" />
          Edit Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-[#3a5c90]">Edit account</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleEditAccount)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter full name"
                      value={field.value}
                      {...field}
                    />
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
                      value={field.value}
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
                        val={data.role}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <div>
                      <SearchDropdown
                        placeholder="Select Status"
                        data={[{ status: "Active" }, { status: "Inactive" }]}
                        onSubmit={(selectedStatus) => {
                          form.setValue("status", selectedStatus.status, {
                            shouldValidate: true,
                          });
                        }}
                        searchFields={["status"]}
                        mainParameter="status"
                        val={data.status}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isLoading} className={"w-full"}>
                {isLoading ? "Saving Changes..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
