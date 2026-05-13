import express from "express"
import { checkAuth, login, signup, updateProfile } from "../controllers/userController.js"
import { authUser } from "../middleware/auth.js"
const userRouter=express.Router()


userRouter.post("/signup",signup)
userRouter.post("/login",login)
userRouter.put("/update-profile",authUser,updateProfile)
userRouter.get("/check",authUser,checkAuth)

export default userRouter