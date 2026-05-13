import UserModel from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { generateToken } from "../utils/lib.js";
import cloudinary from "../utils/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      return req
        .status(401)
        .json({ success: false, error: "Required credientials" });
    }
    const user = await UserModel.find({ email });
    if (user) {
      return req.status(401).json({ success: false, error: "Email id exits" });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = await UserModel.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    const token = await generateToken(newUser._id);
    res.json({
      success: true,
      userData: newUser,
      token,
      message: "user created successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, error: "user created failed" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await UserModel.findOne({ email });
    if (!userData) {
      return req
        .status(401)
        .json({ success: false, error: "Required credientials" });
    }
    const isCorrectPassword = await bcryptjs.compare(
      password,
      userData.password,
    );
    if (!isCorrectPassword) {
      return req
        .status(401)
        .json({ success: false, error: "Not match passwords" });
    }
    const token = await generateToken(userData._id);
    res.json({ success: true, token, userData, message: "login successful" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, profilePic } = req.body;
    const userId = req.user._id;
    let updatedUser;
    if (!profilePic) {
      updatedUser = await UserModel.findOneAndUpdate(
        userId,
        { fullName, bio },
        { new: true },
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, fullName, bio },
        { new: true },
      );
    }

    res.json({
      success: true,
      user: updatedUser,
      message: "User Profile data updated",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
