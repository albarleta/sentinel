import mongoose from "mongoose";

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`DB connected: ${mongoose.connection.name}`);
  } catch (error) {
    console.log("Error connecting to DB:", error);
    process.exit(1);
  }
})();
