import { useState, useEffect } from "react";
import { FaColumns } from "react-icons/fa";
import { FaEdit, FaHistory } from "react-icons/fa";
import { IoCopy } from "react-icons/io5";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  ListCollapse,
  MoreHorizontal,
} from "lucide-react";

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
import { Badge } from "@/components/ui/badge";

//helpers
import { formatDate } from "../helpers/formatDateHelper";

//components
import DocumentViewer from "../components/DocumentViewer";
import EditDocumentReviewer from "../components/EditDocumentReviewer";
import Loading from "../components/Loading.jsx";

//utils
import { fetchDocuments } from "../utils/apiDocument";

const columnHelper = createColumnHelper();

export function ReviewerPage() {
  // const { accessToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false); // track if fetching/loading
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState([]);

  const columns = [
    columnHelper.accessor("trackingNo", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tracking Number
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("trackingNo")}</div>
      ),
    }),
    columnHelper.accessor("managerId", {
      header: "Manager",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          {row.getValue("managerId").name}
          {` <${row.getValue("managerId").email}>`}
        </div>
      ),
    }),
    // columnHelper.accessor("reviewerId", {
    //   header: "Reviewer",
    //   cell: ({ row }) => (
    //     <div className="whitespace-nowrap">
    //       {row.getValue("reviewerId").name}
    //       {` <${row.getValue("reviewerId").email}>`}
    //     </div>
    //   ),
    // }),
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
    columnHelper.accessor("assignedDate", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Assigned Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          {formatDate(row.getValue("assignedDate"))}
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
                    onClick={() =>
                      navigator.clipboard.writeText(tracking.trackingNo)
                    }
                  >
                    <IoCopy className="text-[#4971bb]" />
                    Copy Tracking Number
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <DocumentViewer imageUrl={row.original.fileUrl} />
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <EditDocumentReviewer
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
                  <HistoryLog />
                </DropdownMenuItem>
                {/* <DropdownMenuItem asChild>
                  <DeleteForm
                    data={row.original}
                    onDelete={handleDeleteDocument}
                  />
                </DropdownMenuItem> */}
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

  // Useeffects
  useEffect(() => {
    loadDocuments();
  }, []);

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

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div className="inline-flex gap-4">
          <Input
            placeholder="Filter tracking numbers..."
            value={table.getColumn("trackingNo")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("trackingNo")?.setFilterValue(event.target.value)
            }
            className="max-w-sm w-64"
          />
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
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
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

export default ReviewerPage;
