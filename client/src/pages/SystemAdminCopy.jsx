// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// import SearchDropdown from "../components/SearchDropdown";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// import { Label } from "@/components/ui/label";
// import SignupForm from "../components/SignupForm";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Pencil } from "lucide-react";
// import { useEffect, useState } from "react";

// import useAuthStore from "../store/useAuthStore";

// import {
//   fetchUsers,
//   editAccount,
//   deleteAccount,
// } from "../helpers/authApiHelper";

// export default function SystenAdminPage() {
//   const [open, setOpen] = useState(false);
//   const { users, setUsers, refreshToken } = useAuthStore();
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [editingAccount, setEditingAccount] = useState({
//     _id: "",
//     name: "",
//   });
//   const [editFormValues, setEditFormValues] = useState({
//     role: "",
//     status: "",
//   });

//   useEffect(() => {
//     (async () => {
//       try {
//         const data = await fetchUsers(refreshToken);
//         setUsers(data);
//       } catch (error) {
//         console.error("Failed to fetch users:", error.message);
//       }
//     })();
//   }, []);

//   const handleInputChange = (field, value) => {
//     setEditFormValues((prevValues) => ({
//       ...prevValues,
//       [field]: value, // Dynamically update the specific field
//     }));
//   };

//   const handleEditAccount = (account) => {
//     setEditingAccount({
//       _id: account._id,
//       name: account.name,
//     });
//     setEditFormValues({
//       role: account.role,
//       status: account.status,
//     });
//     setIsDialogOpen(true);
//   };

//   const handleSaveChanges = async () => {
//     try {
//       await editAccount(editingAccount._id, editFormValues, refreshToken);

//       const data = await fetchUsers(refreshToken);
//       setUsers(data);
//     } catch (error) {
//       console.error("Error editing user:", error);
//     }
//     setIsDialogOpen(false);
//   };

//   const handleDelete = async (accountId) => {
//     try {
//       await deleteAccount(accountId, refreshToken);

//       const data = await fetchUsers(refreshToken);
//       setUsers(data);
//     } catch (error) {
//       console.error("Error deleting user:", error);
//     }
//   };

//   const handleSubmit = async (id) => {
//     const filtered = users.filter((user) => user._id === id);

//     setFilteredUsers(
//       JSON.stringify(filtered) !== JSON.stringify(filteredUsers)
//         ? filtered
//         : users
//     );
//   };

//   const formatDate = (isoDateString) => {
//     const date = new Date(isoDateString);
//     return date.toLocaleDateString("en-US", {
//       month: "2-digit",
//       day: "2-digit",
//       year: "numeric",
//     });
//   };

//   useEffect(() => {
//     setFilteredUsers(users);
//   }, [users]);

//   return (
//     <div className="flex flex-col items-center p-4">
//       <SearchDropdown
//         placeholder={"Search by name or email"}
//         data={users}
//         onSubmit={handleSubmit}
//         searchFields={["name", "email"]}
//         mainParameter="name"
//         subParameter="email"
//         k="_id"
//       />

//       <Card className="w-full mt-12 shadow-lg">
//         <CardHeader className="flex flex-col items-center justify-between gap-4">
//           <CardTitle className="text-center">Accounts List</CardTitle>
//           <div className="flex gap-4 flex-col sm:flex-row">
//             <Dialog open={open} onOpenChange={setOpen}>
//               <DialogTrigger asChild>
//                 <Button variant="outline">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth={1.5}
//                     stroke="currentColor"
//                     className="size-6"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M12 4.5v15m7.5-7.5h-15"
//                     />
//                   </svg>

//                   <span>Create new account</span>
//                 </Button>
//               </DialogTrigger>
//               <DialogContent
//                 className="sm:max-w-[425px]"
//                 aria-describedby={undefined}
//               >
//                 <DialogHeader>
//                   <DialogTitle className="text-center">
//                     Create New Account
//                   </DialogTitle>
//                 </DialogHeader>

//                 <SignupForm closeDialog={() => setOpen(false)} />
//               </DialogContent>
//             </Dialog>
//           </div>
//         </CardHeader>
//         <CardContent className="overflow-x-auto">
//           <div className="min-w-[600px]">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-[200px]">Name</TableHead>
//                   <TableHead className="w-[200px]">Email</TableHead>
//                   <TableHead>Role</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Date Created</TableHead>
//                   <TableHead className="text-center">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredUsers.map((account) => (
//                   <TableRow key={account._id}>
//                     <TableCell className="font-medium">
//                       {account.name}
//                     </TableCell>
//                     <TableCell>{account.email}</TableCell>
//                     <TableCell>{account.role}</TableCell>
//                     <TableCell>{account.status}</TableCell>
//                     <TableCell>{formatDate(account.createdAt)}</TableCell>
//                     <TableCell className="flex gap-2 justify-end">
//                       <Dialog
//                         open={isDialogOpen}
//                         onOpenChange={(isOpen) => setIsDialogOpen(isOpen)}
//                       >
//                         <DialogTrigger asChild>
//                           <Button onClick={() => handleEditAccount(account)}>
//                             <Pencil className="size-6 mr-2" />
//                             <span>Edit</span>
//                           </Button>
//                         </DialogTrigger>
//                         <DialogContent className="sm:max-w-[425px]">
//                           <DialogHeader>
//                             <DialogTitle>Edit Account</DialogTitle>
//                             <DialogDescription>
//                               {editingAccount.name}
//                             </DialogDescription>
//                           </DialogHeader>
//                           <div className="grid gap-4 py-4">
//                             <div className="grid grid-cols-4 items-center gap-4">
//                               <Label htmlFor="role" className="text-right">
//                                 Role
//                               </Label>
//                               <Select
//                                 value={editFormValues.role || account.role} // Controlled component
//                                 onValueChange={(value) =>
//                                   handleInputChange("role", value)
//                                 } // Update state
//                               >
//                                 <SelectTrigger className="col-span-3">
//                                   <SelectValue placeholder="Select role" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   <SelectItem value="Manager">
//                                     Manager
//                                   </SelectItem>
//                                   <SelectItem value="Reviewer">
//                                     Reviewer
//                                   </SelectItem>
//                                 </SelectContent>
//                               </Select>
//                             </div>
//                             <div className="grid grid-cols-4 items-center gap-4">
//                               <Label htmlFor="status" className="text-right">
//                                 Status
//                               </Label>
//                               <Select
//                                 value={editFormValues.status || account.status} // Controlled component
//                                 onValueChange={(value) =>
//                                   handleInputChange("status", value)
//                                 } // Update state
//                               >
//                                 <SelectTrigger className="col-span-3">
//                                   <SelectValue placeholder="Select status" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   <SelectItem value="Active">Active</SelectItem>
//                                   <SelectItem value="Inactive">
//                                     Inactive
//                                   </SelectItem>
//                                 </SelectContent>
//                               </Select>
//                             </div>
//                           </div>
//                           <DialogFooter>
//                             <Button onClick={handleSaveChanges} type="submit">
//                               Save changes
//                             </Button>
//                           </DialogFooter>
//                         </DialogContent>
//                       </Dialog>

//                       <Dialog>
//                         <DialogTrigger asChild>
//                           <Button variant="destructive">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                               strokeWidth={1.5}
//                               stroke="currentColor"
//                               className="size-6 mr-2"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
//                               />
//                             </svg>
//                             <span>Delete</span>
//                           </Button>
//                         </DialogTrigger>
//                         <DialogContent>
//                           <DialogHeader>
//                             <DialogTitle>
//                               Delete {account.name}'s account?
//                             </DialogTitle>
//                             <DialogDescription>
//                               This action cannot be undone. This will
//                               permanently delete{" "}
//                               <span className="font-bold">
//                                 {account.name}'s{" "}
//                               </span>{" "}
//                               account and data from our servers.
//                             </DialogDescription>
//                           </DialogHeader>
//                           <DialogFooter>
//                             <Button onClick={() => handleDelete(account._id)}>
//                               Confirm
//                             </Button>
//                           </DialogFooter>
//                         </DialogContent>
//                       </Dialog>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
