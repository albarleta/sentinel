import Document from "../models/documentModel.js";
import User from "../models/authModel.js";
import Notification from "../models/notificationModel.js";

//helper
import { generateUniqueTrackingNo } from "../utils/generateTrackingNo.js";
import { createLog } from "../utils/historyHelper.js";

// Search document for guests
export const searchDocument = async (req, res) => {
  const { trackingNo } = req.params;
  try {
    const document = await Document.findOne({ trackingNo });
    if (!document) {
      return res
        .status(404)
        .json({ status: "fail", message: "Document not found" });
    }
    res.status(200).json({ status: "success", data: document });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Create a new document
export const createDocument = async (req, res) => {
  try {
    const { name, type, reviewerId } = req.body;

    // Generate a unique tracking number
    const trackingNo = await generateUniqueTrackingNo();
    // Handle file upload (fileUrl comes from Cloudinary)
    const fileUrl = req.file?.path;
    const managerId = req.user.id;
    const manager = await User.findById(managerId);
    const managerName = manager.name;
    const document = await Document.create({
      trackingNo,
      name,
      type,
      fileUrl,
      managerId,
      reviewerId,
    });
    // Create notification for the reviewer
    const newNotification = await new Notification({
      reviewerId: reviewerId,
      // message: `Document ${generatedTrackingNumber} is assigned to you by ${managerName}`,
      message: `${trackingNo} is assigned to you by ${managerName}`,
    }).save();
    // Fetch all notifications for the user to emit
    const notifications = await Notification.find({
      reviewerId: reviewerId,
    }).sort({ createdAt: -1 });
    // Emit notifications via Socket.IO
    req.io.to(reviewerId.toString()).emit("newNotification", notifications);

    //create log
    const params = {
      documentId: document._id,
      userId: managerId,
      action: ["Created", "Assigned"],
      previousState: null,
      currentState: document,
      remarks: "",
    };

    await createLog(params);

    res
      .status(201)
      .json({ message: "Document created successfully", document });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating document", error: error.message });
  }
};

// Get documents
export const getDocuments = async (req, res) => {
  try {
    const userId = req.user.id; // Logged-in user's ID
    const userRole = req.user.role; // Role of the logged-in user (Manager/Reviewer)

    const { status } = req.query; // Status comes from query params

    // Base query
    const query = {};

    if (userRole === "Manager") {
      query.managerId = userId; // Filter by manager ID
    } else if (userRole === "Reviewer") {
      query.reviewerId = userId; // Filter by reviewer ID
    } else {
      return res.status(403).json({
        message:
          "Access denied. Only Managers and Reviewers can view documents.",
      });
    }

    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    // Fetch documents with populated manager and reviewer details
    const documents = await Document.find(query).populate(
      "managerId reviewerId",
      "name email"
    );

    res.status(200).json(documents);
  } catch (error) {
    console.error("Error retrieving documents:", error);
    res.status(500).json({
      message: "Error retrieving documents",
      error: error.message,
    });
  }
};

// Get by trackingNo but only if same systemAdminId
export const getDocumentByTrackingNo = async (req, res) => {
  try {
    const { trackingNo } = req.params;
    const managerId = req.user.id; // Manager ID from authentication

    // Fetch the logged-in manager's systemAdminId

    const manager = await User.findById(managerId).select("systemAdminId");
    if (!manager || !manager.systemAdminId) {
      return res
        .status(403)
        .json({ message: "Unauthorized access. Missing systemAdminId." });
    }

    const managerSystemAdminId = manager.systemAdminId;

    // Find the document by tracking number
    const document = await Document.findOne({ trackingNo }).populate(
      "managerId reviewerId",
      "systemAdminId name email"
    );

    if (!document) {
      return res.status(404).json({ message: "Document not found." });
    }

    // Check if the logged-in manager's systemAdminId matches the document's manager's systemAdminId
    if (
      document.managerId.systemAdminId.toString() !==
      managerSystemAdminId.toString()
    ) {
      return res.status(403).json({
        message: "Access denied. Manager's systemAdminId does not match.",
      });
    }

    res.status(200).json(document);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving document", error: error.message });
  }
};

// Get a single document by ID
export const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id).populate(
      "managerId reviewerId",
      "name email"
    );

    console.log(document);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json(document);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving document", error: error.message });
  }
};

// Update a document by ID
export const updateDocument = async (req, res) => {
  try {
    const { id } = req.params; // Document ID
    const { name, type, reviewerId, status, remarks } = req.body; // Fields from the request body

    // Fetch the existing document
    const existingDocument = await Document.findById(id);
    if (!existingDocument) {
      return res.status(404).json({ message: "Document not found" });
    }
    if (existingDocument.status === "Approved") {
      return res.status(403).json({ message: "Document already approved!" });
    }

    // Check the role of the logged-in user
    const userId = req.user.id;
    const userRole = req.user.role; // Assuming `role` is available in the auth payload (e.g., "Manager" or "Reviewer")

    // Managers: Can edit all fields
    if (userRole === "Manager") {
      const updatedData = {
        name: name || existingDocument.name,
        type: type || existingDocument.type,
        reviewerId: reviewerId || existingDocument.reviewerId,
        fileUrl: req.file ? req.file.path : existingDocument.fileUrl, // Update fileUrl if a new file is uploaded
        status: "Pending",
        remarks: remarks || "",
        managerId:
          userId !== existingDocument.managerId
            ? userId
            : existingDocument.managerId,
      };

      // Update assignedDate if reviewerId changes
      if (reviewerId && existingDocument.reviewerId.toString() !== reviewerId) {
        updatedData.assignedDate = Date.now();
      }

      // Removed as possible the manager suddenly MIA and the document needs to be updated
      // // Ensure the logged-in manager matches the document's manager
      // if (existingDocument.managerId.toString() !== userId) {
      //   return res.status(403).json({
      //     message:
      //       "Access denied. Only the assigned manager can edit this document.",
      //   });
      // }

      const params = {
        documentId: id,
        userId,
        action: ["Updated"],
        previousState: existingDocument,
        remarks: remarks,
      };

      if (updatedData.status !== existingDocument.status) {
        params.action.push("StatusChanged");
        if (updatedData.status === "Pending") {
          params.action = params.action.filter((item) => item !== "Reviewed");
          params.action.push("Assigned");
        } else {
          params.action.push(updatedData.status);
        }
      }

      if (updatedData.reviewerId !== existingDocument.reviewerId.toString())
        params.action.push("Assigned");

      // Update the document
      const updatedDocument = await Document.findByIdAndUpdate(
        id,
        updatedData,
        {
          new: true,
          runValidators: true,
        }
      ).populate("managerId reviewerId", "name email");

      params.currentState = updatedDocument;

      await createLog(params);

      return res
        .status(200)
        .json({ message: "Document updated successfully", updatedDocument });
    }

    // Reviewers: Can only update status and remarks
    if (userRole === "Reviewer") {
      if (existingDocument.reviewerId.toString() !== userId) {
        return res.status(403).json({
          message:
            "Access denied. You are not the assigned reviewer for this document.",
        });
      }

      const updatedData = {
        status: status || existingDocument.status,
        remarks: remarks || "",
      };

      const params = {
        documentId: id,
        userId,
        action: ["Updated"],
        previousState: existingDocument,
        remarks: remarks,
      };

      if (updatedData.status !== existingDocument.status) {
        params.action.push("StatusChanged");
        if (updatedData.status !== "Pending") {
          params.action.push(updatedData.status);
          params.action = params.action.filter((item) => item !== "Assigned");
          params.action.push("Reviewed");
        }
      }

      // Update the document
      const updatedDocument = await Document.findByIdAndUpdate(
        id,
        updatedData,
        {
          new: true,
          runValidators: true,
        }
      );

      params.currentState = updatedDocument;

      await createLog(params);

      return res.status(200).json({
        message: "Status and remarks updated successfully",
        updatedDocument,
      });
    }

    // If neither Manager nor Reviewer
    return res.status(403).json({
      message:
        "Access denied. You do not have the required permissions to update this document.",
    });
  } catch (error) {
    console.error("Error updating document:", error);
    res
      .status(500)
      .json({ message: "Error updating document", error: error.message });
  }
};

// Delete a document by ID
export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDocument = await Document.findByIdAndDelete(id);

    if (!deletedDocument) {
      return res.status(404).json({ message: "Document not found" });
    }

    res
      .status(200)
      .json({ message: "Document deleted successfully", deletedDocument });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting document", error: error.message });
  }
};
