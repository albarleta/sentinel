import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../configs/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Sentinel", // Folder name in Cloudinary
    allowed_formats: ["jpg", "png", "pdf", "docx"], // Allowed file formats
  },
});

const upload = multer({ storage });

export default upload;
