//libraries
import { useState, useEffect } from "react";

//ui
import { FaColumns } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import { IoCopy } from "react-icons/io5";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useToast } from "@/hooks/use-toast";

//context/zustand
// import useAuthStore from "../store/useAuthStore.js";

//components
import AddAccountForm from "../components/AddAccountForm.jsx";
import DeleteAccountForm from "../components/DeleteAccountForm.jsx";
import EditAccountForm from "../components/EditAccountForm.jsx";
import Loading from "../components/Loading.jsx";

//helpers
import { formatDate } from "../helpers/formatDateHelper";

//utils
import { fetchUsers, deleteAccount } from "../utils/apiAuth.js";

export default function SystemAdminPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Track the search query
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState([]);

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("role")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("status")}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date Created",
      cell: ({ row }) => <div>{formatDate(row.getValue("createdAt"))}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Button
                  variant="outline"
                  className="border-slate-500 text-black hover:bg-slate-100 w-full"
                  onClick={() =>
                    navigator.clipboard.writeText(row.original.email)
                  }
                >
                  <IoCopy className="text-[#3a5c90] mr-2" />
                  Copy User Email
                </Button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <EditAccountForm
                  getUsers={getUsers}
                  data={row.original}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <DeleteAccountForm
                  data={row.original}
                  onDelete={handleDeleteAccount}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const getUsers = () => {
    setIsLoading(true);

    // Fetch all users using the util function
    fetchUsers()
      .then((data) => setData(data)) // Assuming setData is used to set the state or handle the fetched data
      .catch((error) => console.error("Error fetching users:", error))
      .finally(() => setIsLoading(false));
  };

  const handleDeleteAccount = (id) => {
    setIsLoading(true);
    deleteAccount(id)
      .then(() => {
        getUsers(); // Refresh the user list after deleting the account

        toast({
          title: "Account Deleted!",
          description: "The account has been successfully deleted.",
          className: "bg-[#82F4E5] text-gray-700",
          duration: 2000,
        });
      })
      .catch((error) => {
        console.error("Error deleting account:", error);
        toast({
          title: "Failed to Delete Account!",
          description:
            error.message || "An error occurred while deleting the account.",
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

  useEffect(() => {
    getUsers(); // Fetch the users when the component mounts
  }, []);

  // Debounce search query for users
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        setIsLoading(true);
        // Fetch users with the search query using fetchUsers helper
        fetchUsers(searchQuery)
          .then((data) => {
            setData(data); // Update table data with filtered results
          })
          .catch((error) => {
            console.error("Error fetching users:", error);
          })
          .finally(() => {
            setTimeout(() => {
              setIsLoading(false);
            }, 2000);
          });
      } else {
        // If the search query is empty, fetch all users
        getUsers();
      }
    }, 500); // 500ms delay to avoid calling API on every keystroke

    return () => clearTimeout(delayDebounceFn); // Cleanup timeout on unmount or query change
  }, [searchQuery]);

  // Function to clear the search input
  const handleClearSearch = () => {
    setSearchQuery(""); // Clears the search query
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="py-4 inline-flex gap-4">
          <Input
            placeholder="Filter accounts by email..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)} // Update the searchQuery state on input change
            className="max-w-sm w-64"
          />
          {/* Clear Button */}
          {searchQuery ? (
            <Button variant="outline" onClick={handleClearSearch}>
              <IoMdRefresh className="" />
            </Button>
          ) : (
            <></>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <FaColumns className="text-[#3a5c90]" />
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* <CreateForm onUploadDocument={handleUploadDocument} /> */}

        <AddAccountForm
          getUsers={getUsers}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="relative">
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <Loading bgColor="bg-white" position="absolute" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        {/* <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div> */}
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
