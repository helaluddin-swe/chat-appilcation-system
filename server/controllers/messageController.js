
// get all user for sideabar user

import MessageModel from "../models/messageModel.js";
import UserModel from "../models/userModel.js";
import cloudinary from "../utils/cloudinary.js";
import { io,userSocketMap } from "../server.js";
export const getSidebarUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const filterUser = (await UserModel.find({ _id: { $ne: userId } })).select(
      "-password",
    );

    let unseenMessage = {};
    const promises = await filterUser.map(async (user) => {
      const messages = await MessageModel.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessage[user._id] = messages.length;
      }
    });
    await Promise.all(promises);
    res.json({ success: true, user: filterUser, unseenMessage });
  } catch (error) {
    console.log(error.messages);

    res.json({ success: false, messages: error.messages });
  }
};

// get all message for seleted user
export const getMessage = async (req, res) => {
  try {
    const { id: selectedId } = req.params;
    const myId = req.user._id;
    const messages = await MessageModel.find({
      $or: [
        { senderId: myId, receiverId: selectedId },
        { senderId: selectedId, receiverId: myId },
      ],
    });
    await MessageModel.updateMany({ senderId: selectedId, receiverId: myId },{seen:true});
    res.json({ success: true, messages });
  } catch (error) {
    console.log(error.messages);

    res.json({ success: false, messages: error.messages });
  }
};


// api to mark message as seen by message id

export const getMessageAsSeen=async(req,res)=>{
  try {
    const {id}=req.params 
    await MessageModel.findByIdAndUpdate(id,{seen:true})
    res.json({success:true})
    
  } catch (error) {
    console.log(error.messages);

    res.json({ success: false, messages: error.messages });
    
  }
}

export const sendMessage=async(req,res)=>{
  try {
    const {text,image}=req.body 
    const receiverId=req.params.id
    const senderId=req.user._id 
    let imageUrl
    if(image){
      const ResponseUpload=await cloudinary.uploader.upload(image)
      imageUrl=ResponseUpload.secure_url
    }
    const newMessage={
      senderId,receiverId,text,image:imageUrl
    }
   const message= await MessageModel.create(newMessage)

    //  soketid -update real time
    const receiverSocketId=userSocketMap[receiverId]
    if(receiverSocketId ){
      io.to(receiverSocketId).emit("new Message",message)
    }


    res.json({success:true,message})

  } catch (error) {
     console.log(error.messages);

    res.json({ success: false, messages: error.messages });
  }
}