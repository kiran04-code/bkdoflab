import mongoose from "mongoose";


export const dbConnection = async(url)=>{
 try {
    await mongoose.connect(url)
 } catch (error) {
    console.log(error)
 }
}