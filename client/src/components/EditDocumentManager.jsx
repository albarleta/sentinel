import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// import useAuthStore from "../store/useAuthStore.js";
import { useEffect, useState } from "react";

import ReviewerDropdown from "./ReviewerDropdown.jsx";
import { getReviewers } from "../utils/apiAuth.js";
import { handleEditDocument } from "../utils/apiDocument.js";

export default function EditDocumentManager({
  data,
  isLoading,
  setIsLoading,
  loadDocuments,
}) {
  // const { accessToken } = useAuthStore();
  const { toast } = useToast();
  const [reviewers, setReviewers] = useState([]);

  // New state to manage dialog open/close
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get reviewers
  const fetchReviewers = async () => {
    getReviewers()
      .then((data) => setReviewers(data))
      .catch((error) => console.error("Error fetching reviewers:", error));
  };

  useEffect(() => {
    fetchReviewers();
  }, []);

  // State to manage form inputs
  const [formData, setFormData] = useState({
    name: data.name,
    type: data.type,
    file: data.fileUrl,
    reviewerId: data.reviewerId._id,
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === "file" ? files[0] : value,
    }));
  };

  // Handle reviewer selection
  const handleReviewerSelect = (selectedReviewer) => {
    setFormData((prevData) => ({
      ...prevData,
      reviewerId: selectedReviewer._id,
    }));
  };

  const handleUpload = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let errMessage = "";
    let isValid = true;
    const noChange =
      formData.name === data.name &&
      formData.type === data.type &&
      formData.reviewerId === data.reviewerId._id &&
      formData.file === data.fileUrl;
    const isApproved = data.status === "Approved";
    const isRejected =
      data.status === "Rejected" && formData.file === data.fileUrl;

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
      toast({
        title: "Failed!",
        description: errMessage,
        variant: "destructive",
        duration: 2000,
      });
      setIsLoading(false);
      setIsDialogOpen(true);
      return;
    }

    // Create FormData object for file upload
    const uploadData = new FormData();
    uploadData.append("name", formData.name);
    uploadData.append("type", formData.type);
    uploadData.append("fileUrl", formData.file);
    uploadData.append("reviewerId", formData.reviewerId);

    handleEditDocument(data._id, uploadData) // use to upload edited document
      .then(() => {
        loadDocuments(); // Refresh the document list after editing the document
        toast({
          title: "Success!",
          description: "The document request has been successfully edited.",
          className: "bg-[#82F4E5] text-gray-700",
          duration: 2000,
        });

        setIsDialogOpen(false);
        setFormData({
          name: "",
          type: "",
          fileUrl: null,
          reviewerId: null,
        });
      })
      .catch((error) => {
        console.error("Error editing document request:", error);
        toast({
          title: "Failed!",
          description:
            error.message ||
            "An error occurred while editing the document request.",
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

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FaEdit className="text-[#4971bb]" />
          Edit document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[#4971bb]">Edit document</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Input
              id="type"
              value={formData.type}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              File
            </Label>
            <div className="col-span-3">
              <Input id="file" type="file" onChange={handleInputChange} />
              <span className="text-xs italic text-red-400">
                Leave blank if you want to retain current document
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reviewer" className="text-right">
              Reviewer
            </Label>
            <ReviewerDropdown
              data={reviewers}
              placeholder={"Search by name or email"}
              onSubmit={handleReviewerSelect}
              reviewerId={formData.reviewerId}
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
                Editing document
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              "Edit document"
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
