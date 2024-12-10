import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaHistory } from "react-icons/fa";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { getDocumentHistoryLog } from "../utils/apiDocument.js";
import Loading from "../components/Loading";
import { useEffect } from "react";

const HistoryLog = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const fetchHistoryLogs = () => {
    setIsLoading(true);

    const query = {
      page: pagination.page,
      limit: 5,
    };

    getDocumentHistoryLog(data._id, query)
      .then((data) => {
        const { logs, total, page, totalPages } = data;
        setHistoryLogs(logs);
        setPagination({
          page,
          totalPages,
          total,
        });
      })
      .catch((error) => console.error("Error fetching document logs:", error))
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      });
  };

  useEffect(() => {
    fetchHistoryLogs();
  }, []);

  // Pagination handlers
  const handlePreviousPage = () => {
    if (pagination.page > 1) {
      setPagination((prev) => ({ ...prev, page: prev.page-- }));
      fetchHistoryLogs();
    }
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: prev.page++ }));
      fetchHistoryLogs();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FaHistory className="text-[#4971bb] mr-2" /> View History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] w-[80vw] max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>History Log</DialogTitle>
          <DialogDescription>
            Detailed history of document actions and changes
          </DialogDescription>
        </DialogHeader>

        <div className="container mx-auto px-4 py-4">
          {isLoading ? (
            <div className="text-center">Loading history...</div>
          ) : (
            <>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">User</TableHead>
                      <TableHead className="font-semibold">Role</TableHead>
                      <TableHead className="font-semibold">Action</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan="5" className="h-40 text-center">
                          <Loading bgColor="bg-white" position="absolute" />
                        </TableCell>
                      </TableRow>
                    ) : historyLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan="5" className="text-center">
                          No history logs found
                        </TableCell>
                      </TableRow>
                    ) : (
                      historyLogs.map((log) => (
                        <TableRow key={log._id}>
                          <TableCell>
                            {`${log.userId?.name} <${log.userId?.email}>` ||
                              log.userId ||
                              "Unknown User"}
                          </TableCell>
                          <TableCell>{log.userId.role}</TableCell>
                          <TableCell>{log.action.join(", ")}</TableCell>
                          <TableCell>
                            {format(
                              new Date(log.timestamp),
                              "yyyy-MM-dd HH:mm:ss"
                            )}
                          </TableCell>
                          <TableCell>{log.remarks || "-"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Page {pagination.page} of {pagination.totalPages}
                    {` (${pagination.total} total logs)`}
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={handlePreviousPage}
                          className={
                            pagination.page === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          onClick={handleNextPage}
                          className={
                            pagination.page === pagination.totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HistoryLog;
