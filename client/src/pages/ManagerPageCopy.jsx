import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";

import SearchDropdown from "../components/SearchDropdown";
import DocumentForm from "../components/DocumentForm";
import ViewRecord from "../components/ViewRecord";
import EditDocument from "../components/EditDocument";
import ManagerLog from "../components/ManagerLog";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Edit, Eye, FileUp, History, Trash } from "lucide-react";

export default function ManagerPage() {
  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const {
    accessToken,

    documents,
    setDocuments,
  } = useAuthStore();

  const fetchDocuments = async () => {
    const res = await fetch("http://localhost:5000/api/v1/documents", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    setDocuments(data);
  };

  const handleSubmit = (k) => {
    const f = documents.filter((document) => document.trackingNo === k);

    setFiltered((prevState) =>
      JSON.stringify(prevState) === JSON.stringify(f) ? documents : f
    );
  };

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }

  useEffect(() => {
    fetchDocuments();
  }, [accessToken]);

  useEffect(() => {
    setFiltered(documents);
  }, [documents]);

  return (
    <div className="flex flex-col items-center p-4">
      <SearchDropdown
        placeholder="Search by tracking number"
        data={documents}
        searchFields={["trackingNo"]}
        mainParameter="trackingNo"
        subParameter="name"
        onSubmit={handleSubmit}
        k="trackingNo"
      />

      <Card className="w-full mt-12">
        <CardHeader className="flex flex-col items-center justify-between gap-4">
          <CardTitle className="text-center">Documents List</CardTitle>
          <div className="flex gap-4 flex-col sm:flex-row">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                    />
                  </svg>

                  <span>Upload new document</span>
                </Button>
              </DialogTrigger>
              <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Create New Document
                  </DialogTitle>
                </DialogHeader>

                <DocumentForm closeDialog={() => setOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Tracking Number</TableHead>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead className="text-center">Assigned Date</TableHead>
                  <TableHead>Reviewer</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((document) => (
                  <TableRow key={document._id}>
                    <TableCell>{document.trackingNo}</TableCell>
                    <TableCell className="font-medium text-center">
                      {document.name}
                    </TableCell>
                    <TableCell
                      className={`px-4 py-2 font-semibold ${
                        document.status === "Approved"
                          ? "text-green-500"
                          : document.status === "Pending"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {document.status}
                    </TableCell>
                    <TableCell>{document.type}</TableCell>
                    <TableCell>{document.remarks}</TableCell>

                    <TableCell>{formatDate(document.assignedDate)}</TableCell>
                    <TableCell className="text-center">
                      {document.reviewerId.name}
                    </TableCell>

                    <TableCell className="flex gap-2">
                      {/* { view Document} */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {document.name}'s document
                            </DialogTitle>

                            <ViewRecord closeDialog={() => setOpen(false)} />
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>

                      {/* edit document */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="text-center">
                              Edit: {document.trackingNo}
                            </DialogTitle>
                            <EditDocument closeDialog={() => setOpen(false)} />
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>

                      {/* historylog */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <History className="h-4 w-4" />
                            History
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="text-center pb-10">
                              History for Tracking no. {document.trackingNo}
                            </DialogTitle>
                            <ManagerLog closeDialog={() => setOpen(false)} />
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>

                      {/* Delete Doc */}

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Trash className="h-4 w-4" />
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Delete {document.name}'s document?
                            </DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will
                              permanently delete{" "}
                              <span className="font-bold">
                                {document.name}'s{" "}
                              </span>{" "}
                              document and data from our servers.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button onClick={() => {}}>Confirm</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
