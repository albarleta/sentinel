import { Button } from "@/components/ui/button";
import { MdOutlineFileUpload } from "react-icons/md";
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
import { Loader2 } from "lucide-react";

import ReviewerDropdown from "./ReviewerDropdown.jsx";
import { useToast } from "@/hooks/use-toast";

import { useEffect, useState } from "react";

import { uploadDocument } from "../utils/apiDocument.js";
import { getReviewers } from "../utils/apiAuth.js";

export default function CreateDocumentForm({
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
    name: "",
    type: "",
    file: null,
    reviewerId: "",
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

  const handleUpload = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    // validation
    let errMessage = "";
    let isValid = true;
    const notEmpty =
      !formData.name.length ||
      !formData.type.length ||
      !formData.reviewerId.length ||
      !formData.file;

    if (notEmpty) {
      errMessage = "All fields must be edited.";
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

    uploadDocument(uploadData) // use to upload document
      .then(() => {
        loadDocuments(); // Refresh the document list after adding the document
        toast({
          title: "New Document Request Created!",
          description: "The new document has been successfully added.",
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
        console.error("Error creating document request:", error);
        toast({
          title: "Failed to Create Document Request!",
          description:
            error.message ||
            "An error occurred while creating the document request.",
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
          <MdOutlineFileUpload className="text-[#4971bb]" />
          Upload document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[#4971bb]">Upload document</DialogTitle>
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
            <Input
              id="file"
              type="file"
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reviewer" className="text-right">
              Reviewer
            </Label>
            <ReviewerDropdown
              data={reviewers}
              placeholder={"Search by name or email"}
              onSubmit={handleReviewerSelect}
            />
          </div>
        </div>
        <DialogFooter>
          <button
            className="px-4 py-2 bg-[#82f4e5] text-gray-700 font-bold rounded-tl-3xl transition-colors w-48"
            type="submit"
            onClick={handleUpload}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex justify-center items-center gap-2">
                Uploading
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              "Upload"
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
