import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["SystemAdmin", "Manager", "Reviewer"],
      required: true,
    },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    contactInfo: { type: String }, // For SystemAdmin
    groupName: { type: String }, // For SystemAdmin
    systemAdminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // For Manager/Reviewer
    refreshTokens: [{ type: String }], // Array to store multiple refresh tokens
  },
  {
    timestamps: true,
  }
);

const AuthModel = mongoose.model("User", authSchema);

export default AuthModel;
