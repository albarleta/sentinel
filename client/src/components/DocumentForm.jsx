import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState } from "react";

export default function DocumentForm() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [images, setImages] = useState(null); // Single file or multiple files
  const [assignTo, setAssignTo] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("type", type);
    formData.append("assignTo", assignTo);

    if (images) {
      Array.from(images).forEach((file) => {
        formData.append("images", file);
      });
    }

    try {
      const response = await fetch(
        `https://localhost:5000/api/v1/documents/create`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error(" Error Saving file!");

      const data = await response.json();
      console.log(data);

      setSuccessMessage("New Document has been sent");
      setName("");
      setType("");
      setImages(null);
      setAssignTo("");
    } catch (error) {
      console.log("Error saving data!", error);
      setSuccessMessage("");
    }
  };

  return (
    <Card className="  bg-gray-100">
      <CardContent className="pt-6">
        <form className="space-y-6">
          <div className="grid grid-cols-[140px,1fr] items-center gap-4">
            <Label htmlFor="documents" className="font-medium">
              Upload Documents :
            </Label>
            <Input
              id="documents"
              type="file"
              className="bg-white"
              onChange={(e) => setImages(e.target.files)}
            />
          </div>

          <div className="grid grid-cols-[140px,1fr] items-center gap-4">
            <Label htmlFor="name" className="font-medium">
              Name:
            </Label>
            <Input
              id="name"
              className="bg-white"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-[140px,1fr] items-center gap-4">
            <Label htmlFor="type" className="font-medium">
              Type:
            </Label>
            <Input
              id="type"
              className="bg-white"
              onChange={(e) => setType(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-[140px,1fr] items-center gap-4">
            <Label htmlFor="assign" className="font-medium">
              Assign to:
            </Label>
            <Select
              onValueChange={(value) => setAssignTo(value)}
              value={assignTo}
            >
              <SelectTrigger id="assign" className="bg-white">
                <SelectValue placeholder="Search a Reviewer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reviewer1">Reviewer 1</SelectItem>
                <SelectItem value="reviewer2">Reviewer 2</SelectItem>
                <SelectItem value="reviewer3">Reviewer 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-center pt-4">
            <Button>Confirm</Button>
          </div>

          {successMessage && (
            <div className="text-center text-green-500 font-medium">
              {successMessage}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
