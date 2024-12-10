import mongoose from "mongoose";

const historyLogSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: [String],
      enum: [
        "Created",
        "Updated",
        "StatusChanged",
        "Assigned",
        "Reviewed",
        "Approved",
        "Rejected",
      ],
      required: true,
    },
    previousState: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    currentState: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    remarks: {
      type: String,
      default: "",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const HistoryLog = mongoose.model("HistoryLog", historyLogSchema);

export default HistoryLog;
