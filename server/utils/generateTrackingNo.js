import Document from "../models/documentModel.js";

// Helper function to generate a random string of letters
const generateRandomLetters = () => {
  return Array(3)
    .fill(null)
    .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))) // A-Z
    .join("");
};

// Helper function to generate a random tracking number
const generateTrackingNo = () => {
  const lettersPart = generateRandomLetters(); // Generate three random letters
  const randomPart = Math.random().toString(36).substr(2, 8).toUpperCase(); // Generate 8 random alphanumeric characters
  return `${lettersPart}-${randomPart}`;
};

// Ensure the tracking number is unique
export const generateUniqueTrackingNo = async () => {
  let trackingNo = generateTrackingNo();
  // Check if the tracking number already exists in the database
  let existingDocument = await Document.findOne({ trackingNo });
  while (existingDocument) {
    // If it exists, generate a new tracking number
    trackingNo = generateTrackingNo();
    existingDocument = await Document.findOne({ trackingNo });
  }
  return trackingNo;
};
