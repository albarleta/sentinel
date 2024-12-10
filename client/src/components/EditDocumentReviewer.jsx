import { Button } from "@/components/ui/button";
import { MdOutlineReviews } from "react-icons/md";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Status from "../components/Status.jsx";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import { useState } from "react";

//utils
import { handleEditDocument } from "../utils/apiDocument.js";

export default function EditDocumentReviewer({
  data,
  isLoading,
  setIsLoading,
  loadDocuments,
}) {
  // New state to manage dialog open/close
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // State to manage form inputs
  const [formData, setFormData] = useState({
    status: data.status,
    remarks: data.remarks,
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleStatusUpdate = (status) => {
    setFormData((prevData) => ({
      ...prevData,
      status: status,
    }));
  };

  const handleUpload = (e) => {
    e.preventDefault();

    let errMessage = "";
    let isValid = true;
    setIsLoading((prev) => !prev);

    const noChange =
      formData.status === data.status && formData.remarks === formData.remarks;
    const isApproved = data.status === "Approved";
    const isRejected = data.status === "Rejected";

    if (isApproved) {
      errMessage = "Document request already approved.";
      isValid = false;
    } else if (noChange) {
      errMessage = "No changes detected.";
      isValid = false;
    } else if (isRejected) {
      errMessage = "New document version required.";
      isValid = false;
    }

    if (!isValid) {
      setIsLoading((prev) => !prev);
      setIsDialogOpen((prev) => !prev);
      toast({
        title: "Failed!",
        description: errMessage,
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    // Create FormData object for file upload
    const uploadData = new FormData();
    uploadData.append("status", formData.status);
    uploadData.append("remarks", formData.remarks);

    handleEditDocument(data._id, uploadData) // use to upload edited document
      .then(() => {
        loadDocuments(); // Refresh the document list after editing the document
        toast({
          title: "Success!",
          description: "The document request has been successfully reviewed.",
          className: "bg-[#82F4E5] text-gray-700",
          duration: 2000,
        });

        setIsDialogOpen((prev) => !prev);
        setFormData({
          name: "",
          type: "",
          fileUrl: null,
          reviewerId: null,
        });
      })
      .catch((error) => {
        console.error("Error editing document review:", error);
        toast({
          title: "Failed!",
          description:
            error.message || "An error occurred while submitting the review.",
          variant: "destructive",
          duration: 2000,
        });
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading((prev) => !prev);
        }, 2000);
      });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MdOutlineReviews className="text-[#4971bb]" />
          Review Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[#4971bb]">Review Document</DialogTitle>
          <DialogDescription>{data.name}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Status
            </Label>

            <Status status={data.status} onUpdate={handleStatusUpdate} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="remarks" className="text-right">
              Remarks
            </Label>

            <Textarea
              id="remarks"
              onChange={handleInputChange}
              value={formData.remarks}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <button
            className="px-6 py-2 bg-[#82f4e5] text-gray-700 font-bold rounded-tl-3xl transition-colors"
            type="submit"
            onClick={handleUpload}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex justify-center items-center gap-2">
                Submitting Review
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              "Submit Review"
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
