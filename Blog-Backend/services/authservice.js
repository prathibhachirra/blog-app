import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import {UserTypeModel} from "../models/UserTypeModel.js"
import { config } from "dotenv"
config()

//after password matches then generate an encrypted token
//encrypt can reversible,bcypt cannot reversible
//client will not have access to token

//register function
export const register=async(userObj)=>{
    //create document
    const userDoc=new UserTypeModel(userObj)
    //validate fro empty passwords
    await userDoc.validate()
    //hash and replace plain password
    userDoc.password=await bcrypt.hash(userDoc.password,10)
    //save
    const created=await userDoc.save()
    //convert document to object to remove password
    const newUserObj=created.toObject()
    //remove password bcz no one should see password
    delete newUserObj.password
    //return user obj without passowrd
    return newUserObj
}

//res can be send only by api route or middleware.

//authenticate function

export const authenticate=async({email,password})=>{
    //check user with email and role
    const user=await UserTypeModel.findOne({email})
    if(!user){
        const err=new Error("Invalid email")
        err.status=401
        throw err
    }


    //if user valid ,but blocked by admin


    //compare passwords
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        const err=new Error("Invalid password")
        err.status=401
        throw err
    }
    //check isActive state
    if(user.isActive===false){
        const err=new Error("Your account blocked,Plz contact Admin")
        err.status=403
        throw err
    } 
    //generate token
    const token=jwt.sign({userId:user._id,
        role:user.role,email:user.email,firstName:user.firstName,ProfileImageUrl:user.ProfileImageUrl},
        process.env.JWT_SECRET,{
        expiresIn:"1h"
        }
    )

    //convert document to object
    const userObj=user.toObject()

    //remove password
    delete userObj.password

    //return user details+token
    return {
        user:userObj,
        token
    }
    }