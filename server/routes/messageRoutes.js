import express from "express"

import { authUser } from "../middleware/auth.js"
import { getMessage, getMessageAsSeen, getSidebarUser, sendMessage } from "../controllers/messageController.js"
const messageRouter=express.Router()


messageRouter.get("/",authUser,getSidebarUser)
messageRouter.get("/:id",authUser,getMessage)
messageRouter.put("/mark/:id",authUser,getMessageAsSeen)
messageRouter.post("/send/:id",authUser,sendMessage)

export default messageRouter