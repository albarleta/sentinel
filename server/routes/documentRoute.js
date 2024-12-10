import express from "express";
import {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  getDocumentByTrackingNo,
  searchDocument,
} from "../controllers/DocumentController.js";

import { getHistoryLogs } from "../controllers/HistoryLogController.js";

//middleware
import { authenticate } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

// search router for guests
router.get("/search/:trackingNo", searchDocument);

// Create a new document
router.post(
  "/",
  authenticate(["Manager"]),
  upload.single("fileUrl"),
  createDocument
);

// Get all documents
router.get("/", authenticate(["Manager", "Reviewer"]), getDocuments);

// Get document by trackingNo but only if same systemAdminId
router.get(
  "/tracking/:trackingNo",
  authenticate(["Manager"]),
  getDocumentByTrackingNo
);

// Get a single document by ID
router.get("/:id", authenticate(["Manager", "Reviewer"]), getDocumentById);

// Update a document by ID
router.patch(
  "/:id",
  authenticate(["Manager", "Reviewer"]),
  upload.single("fileUrl"), // Handle file upload for updating a document
  updateDocument
);

// Delete a document by ID
router.delete("/:id", authenticate(["Manager"]), deleteDocument);

// Get history logs for a specific document
router.get(
  "/:documentId/history",
  authenticate(["Manager", "Reviewer"]),
  getHistoryLogs
);

export default router;
