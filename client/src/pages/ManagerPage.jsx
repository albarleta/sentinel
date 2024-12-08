// libraries
import { useEffect, useState } from "react";
// import useAuthStore from "../store/useAuthStore";

// icons
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { FaHistory, FaColumns } from "react-icons/fa";
import { IoCopy } from "react-icons/io5";
import { IoMdRefresh } from "react-icons/io";

// ui
import { Badge } from "@/components/ui/badge";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Components
import CreateDocumentForm from "../components/CreateDocumentForm";
import DeleteForm from "../components/DeleteForm";
// import Search from "../components/Search";
import DocumentViewer from "../components/DocumentViewer";
import EditDocumentManager from "../components/EditDocumentManager";
import Loading from "../components/Loading.jsx";

// helpers
import { formatDate } from "../helpers/formatDateHelper";
const columnHelper = createColumnHelper();

// Utils
import {
  fetchDocuments,
  handleSearch,
  deleteDocument,
} from "../utils/apiDocument";

export function TrackingTableDemo() {
  // const { accessToken } = useAuthStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false); // track if fetching/loading
  const [searchQuery, setSearchQuery] = useState(""); // Track the search query
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState([]);

  // Useeffects
  useEffect(() => {
    loadDocuments();
  }, []);

  // Debounce search query for users
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        setIsLoading(true);
        // Fetch users with the search query using fetchUsers helper
        handleSearch(searchQuery)
          .then((data) => {
            setData([data]); // Update table data with filtered results
          })
          .catch((error) => {
            console.error("Error fetching document request:", error);
            setData([]);
          })
          .finally(() => {
            setTimeout(() => {
              setIsLoading(false);
            }, 2000);
          });
      } else {
        // If the search query is empty, fetch all users
        loadDocuments();
      }
    }, 500); // 500ms delay to avoid calling API on every keystroke

    return () => clearTimeout(delayDebounceFn); // Cleanup timeout on unmount or query change
  }, [searchQuery]);

  // Handlers //
  // Fetch documents
  const loadDocuments = () => {
    setIsLoading(true);

    fetchDocuments()
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching documents:", error))
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      });
  };

  const handleDeleteDocument = async (id) => {
    setIsLoading(true);

    deleteDocument(id)
      .then((data) => {
        toast({
          title: "Success!",
          description: data.message,
          className: "bg-[#82F4E5] text-gray-700",
          duration: 2000,
        });
        loadDocuments();
      })
      .catch((error) => console.error("Error deleting document:", error))
      .finally(() => setIsLoading(false));
  };

  // Function to clear the search input
  const handleClearSearch = () => {
    setSearchQuery(""); // Clears the search query
  };

  // Table
  const columns = [
    columnHelper.accessor("trackingNo", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tracking Number
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("trackingNo")}</div>
      ),
    }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">{row.getValue("name")}</div>
      ),
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <Badge
          className={`px-2 py-1 rounded ${
            row.getValue("status")?.toLowerCase() === "pending"
              ? "bg-yellow-500"
              : row.getValue("status")?.toLowerCase() === "approved"
              ? "bg-green-500"
              : row.getValue("status")?.toLowerCase() === "rejected"
              ? "bg-red-500"
              : "bg-gray-500"
          } text-white`}
        >
          {row.getValue("status")}
        </Badge>
      ),
      filter: ({ column }) => (
        <Input
          type="text"
          value={column.getFilterValue() || ""}
          onChange={(e) => column.setFilterValue(e.target.value)}
          placeholder="Search status"
          className="h-8"
        />
      ),
      canFilter: true,
    }),
    columnHelper.accessor("type", {
      header: "Type",
      cell: ({ row }) => (
        <Badge className="bg-[#7394d1] text-center">
          {row.getValue("type")}
        </Badge>
      ),
    }),
    columnHelper.accessor("remarks", {
      header: "Remarks",
      cell: ({ row }) => <div className="">{row.getValue("remarks")}</div>,
    }),
    columnHelper.accessor("updatedAt", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Last updated
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          {formatDate(row.getValue("updatedAt"))}
        </div>
      ),
      sortingFn: "datetime",
    }),
    columnHelper.accessor("reviewerId", {
      header: "Reviewer",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          {row.getValue("reviewerId").name}
          {` <${row.getValue("reviewerId").email}>`}
        </div>
      ),
    }),
    columnHelper.display({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const tracking = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <div className="flex flex-col">
                <DropdownMenuItem asChild>
                  <Button
                    className="cursor-pointer"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(tracking.trackingNo);
                      toast({
                        title: "Success!",
                        description: "Tracking Number Copied.",
                        className: "bg-[#82F4E5] text-gray-700",
                        duration: 2000,
                      });
                    }}
                  >
                    <IoCopy className="text-[#4971bb]" />
                    Copy Tracking Number
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <DocumentViewer imageUrl={row.original.fileUrl} />
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <EditDocumentManager
                    data={row.original}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    loadDocuments={loadDocuments}
                  />
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Button variant="outline">
                    <FaHistory className="text-[#4971bb]" /> View History
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <DeleteForm
                    data={row.original}
                    onDelete={handleDeleteDocument}
                  />
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
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

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2">
        <div className="py-4 inline-flex gap-4">
          <Input
            placeholder="Search other documents by trackingNo"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)} // Update the searchQuery state on input change
            className="max-w-sm w-72"
          />
          {/* Clear Button */}
          {searchQuery ? (
            <Button variant="outline" onClick={handleClearSearch}>
              <IoMdRefresh />
            </Button>
          ) : (
            <></>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <FaColumns className="text-[#4971bb]" />
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
        <CreateDocumentForm
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          loadDocuments={loadDocuments}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {/* {header.column.columnDef.canFilter
                            ? flexRender(
                                header.column.columnDef.filter,
                                header.getContext()
                              )
                            : null} */}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-40 text-center"
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

export default TrackingTableDemo;
