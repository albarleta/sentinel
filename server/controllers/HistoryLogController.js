import { getDocumentLogs } from "../utils/historyHelper.js";

export const getDocumentHistory = async (req, res) => {
  try {
    const { documentId } = req.params;
    const {
      limit = 50,
      page = 1,
      sortBy = "timestamp",
      sortOrder = "desc",
    } = req.query;

    const result = await getDocumentLogs(documentId, {
      limit: parseInt(limit),
      page: parseInt(page),
      sortBy,
      sortOrder,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error in getDocumentHistory:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve document history",
      error: error.message,
    });
  }
};
