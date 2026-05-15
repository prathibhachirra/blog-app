import exp from "express"
import { UserTypeModel } from "../models/UserTypeModel.js"
export const adminRoute=exp.Router()

//authenticate admin:already defined in commonAPI
//read all articles(optional)

//block users
adminRoute.put("/blockUsers/:uid",async(req,res)=>{
       const uid=req.params.uid
       const user=await UserTypeModel.findById(uid)
       if(!user)
        return res.status(404).json({message:"User not found"})
       user.isActive=false
       user.save()
       res.status(200).json({message:"User blocked",payload:user})
})
//unblock users
adminRoute.put("/UnblockUsers/:uid",async(req,res)=>{
       const uid=req.params.uid
       const user=await UserTypeModel.findById(uid)
       if(!user)
        return res.status(404).json({message:"User not found"})
       user.isActive=true
       user.save()
       res.status(200).json({message:"User Unblocked",payload:user})
})
