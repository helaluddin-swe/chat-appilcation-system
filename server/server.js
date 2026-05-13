import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import http from "http"
import userRouter from "./routes/userRoutes.js"
import { Server } from "socket.io"
import messageRouter from "./routes/messageRoutes.js"

// express and http server
const app=express()
const server=http.createServer(app)
dotenv.config()
connectDB()
const PORT=process.env.PORT

// initilize soket 
export const io=new Server(server,{
  cors:{origin:"*"}
})
// socketmap
export const userSocketMap={}
// connection handler 
io.on("connection",(socket)=>{
  const userId=socket.handshake.query.userId 
  console.log("connected",userId)
  if(userId) userSocketMap[userId]=socket.id 
  io.emit("getOnlineUser",Object.keys(userSocketMap))
  socket.on("disconnect",()=>{
    console.log("disconnect user",userId)
    delete userSocketMap[userId]
    io.emit("getOnlineUser",Object.keys(userSocketMap))

  })
}
  
)


// middleware
app.use(express.json({limit:"4mb"}))
app.use(cors())


app.get("/",(req,res)=>{
  res.send("api is working")
})
app.use("/api/auth",userRouter)
app.use("/api/message",messageRouter)
app.listen(PORT,()=>{
  console.log(`server is running on http://localhost:${PORT}`)
})