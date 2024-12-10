import HistoryLog from "../models/historyLogModel.js";

// Function to create a history log entry
export const createLog = async (params) => {
  const {
    documentId,
    userId,
    action,
    previousState = null,
    currentState = null,
    remarks = "",
  } = params;

  try {
    const historyLog = new HistoryLog({
      documentId,
      userId,
      action,
      previousState,
      currentState,
      remarks,
    });

    return await historyLog.save();
  } catch (error) {
    console.error("Error creating history log:", error);
    throw error;
  }
};

// Function to get history logs for a specific document
export const getDocumentLogs = async (documentId, options = {}) => {
  const {
    limit = 50,
    page = 1,
    sortBy = "timestamp",
    sortOrder = "desc",
  } = options;

  try {
    const logs = await HistoryLog.find({ documentId })
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate("userId", "name email role") // Populate user details
      .exec();

    const total = await HistoryLog.countDocuments({ documentId });

    return {
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching document logs:", error);
    throw error;
  }
};
