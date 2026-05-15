import express from "express"
import { authenticate } from "../services/authservice.js"
import cookieParser from "cookie-parser"
import { compare, hash } from "bcryptjs"
import bcrypt from "bcryptjs"
import { UserTypeModel } from "../models/UserTypeModel.js"
import { verifyToken } from "../middlewares/verifyToken.js"
export const commonRouter=express.Router()

//login
commonRouter.post("/login",async(req,res)=>{
       //get user credential object
           const userCred=req.body
           //call authenticate service
           const {token,user}=await authenticate(userCred)
           //save token as httpOnly cookie
          res.cookie("token", token, {
             httpOnly: true,
             secure: true,
             sameSite: "None"
          });
           //send res
           res.status(200).json({message:"login success",payload:user})
})

//logout
commonRouter.get("/logout",async(req,res)=>{
res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "None"
});
   res.status(200).json({message:"Logged out successfully"})
})

//password change
commonRouter.put("/passwordChange",verifyToken,async(req,res)=>{
    //get current password and new passoword
    const {email,current_password,new_password}=req.body
    //check the current password is correct
    console.log(current_password,new_password)
    let user=await UserTypeModel.findOne({email})
    if (!user) {
    return res.status(404).json({ message: "User not found" })
  }console.log(user.password)
    const checkPassword=await bcrypt.compare(current_password,user.password)
    //replace current passowrd with new password
    if(!checkPassword)
    {
        return res.status(401).json({message:"Anauthorized User"})
    }
    user.password=await bcrypt.hash(new_password,10)
    await user.save()
    //send res
    res.status(200).json({message:"Password changed Successfully"})   
})
//page refresh
commonRouter.get("/check-auth",verifyToken("USER","AUTHOR","ADMIN"),(req,res)=>{
     res.status(200).json({message:"Authenticated",
        payload:req.user
     })
})
