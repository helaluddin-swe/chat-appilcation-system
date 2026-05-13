
import mongoose from "mongoose";
const connectDB=async()=>{
  try {
    mongoose.connection.on("connected",()=>console.log("mongodb connected"))
    await mongoose.connect(process.env.MONGO_URI)
    console.log("connetded",process.env.MONGO_URI)
  } catch (error) {
    console.log(error)
    console.error("connected failed",error.message)
  }
}

export default connectDB