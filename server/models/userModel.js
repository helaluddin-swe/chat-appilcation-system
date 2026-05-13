import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    bio: { type: String },
    profilePic: { type: String, default: "" },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true },
);
const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
export default UserModel;
