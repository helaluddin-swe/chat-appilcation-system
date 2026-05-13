import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

export const authUser = async (req, res, next) => {
  try {
    const token = req.headers.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.find(decoded.userId).select("-password");
    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
