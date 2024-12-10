import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "../helpers/formatDateHelper";

import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

import { Input } from "@/components/ui/input";
import { useState } from "react";

import { requestorSearch } from "../utils/apiDocument.js";

export default function SearchPage() {
  const { toast } = useToast();
  const [document, setDocument] = useState(null);
  const [query, setQuery] = useState("");

  const fetchDocuments = () => {
    requestorSearch(query)
      .then((data) => {
        setDocument(data.data);
        toast({
          title: "Data Successfully Found!",
          description: `Please see the status.`,
          className: "bg-green-300 text-gray-700",
          duration: 2000,
        });
      })
      .catch((error) => {
        console.error("Failed to get user:", error.message);
        toast({
          title: "Document Not Found!",
          description: `Document with a tracking number of (${query.toUpperCase()}) is not in our database.`,
          variant: "destructive",
          duration: 2000,
        });
      });
  };

  const handleSearch = () => {
    fetchDocuments();
    setQuery("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#4971bb]">
      <img src="/sentinel-text-lg.png" className="w-[374px] mb-6" />
      <div className="w-full max-w-md mb-20">
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Search tracking number..."
            className="flex-grow"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="px-6 py-2 bg-[#82f4e5]  text-gray-700 font-bold rounded-tr-3xl transition-colors"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
      <div className="w-[70vw]">
        {document && (
          <Table className="bg-white rounded-md">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Tracking No</TableHead>
                <TableHead className="w-[250px]">Name</TableHead>
                <TableHead className="w-[150px]">Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[200px]">Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  {document.trackingNo}
                </TableCell>
                <TableCell>{document.name}</TableCell>
                <TableCell>
                  {" "}
                  <Badge className="bg-[#7394d1] text-center">
                    {document.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`px-2 py-1 rounded ${
                      document.status === "Pending"
                        ? "bg-yellow-500"
                        : document.status === "Approved"
                        ? "bg-green-500"
                        : document.status === "Rejected"
                        ? "bg-red-500"
                        : "bg-gray-500"
                    } text-white`}
                  >
                    {document.status}
                  </Badge>
                </TableCell>
                <TableCell className="w-[300px]">
                  {formatDate(document.updatedAt)}
                </TableCell>
                <TableCell>{document.remarks}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
