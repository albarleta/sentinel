import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    trackingNo: {
      type: String,
      required: true,
      unique: true, // Ensures the tracking number is unique
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"], // Predefined statuses
      default: "Pending",
    },
    type: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
      default: "", // Optional remarks field
    },
    assignedDate: {
      type: Date,
      default: Date.now, // Defaults to the current date
    },
    fileUrl: {
      type: String,
      // required: true,
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model for the Manager
      required: true,
    },
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model for the Reviewer
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  }
);

const Document = mongoose.model("Document", documentSchema);

export default Document;
