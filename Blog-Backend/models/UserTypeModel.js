import { Schema,model } from "mongoose";
const userSchema=new Schema({

    firstName:{
        type:String,
        required:[true,"First name is required"]
    },
    lastName:{
        type:String   
    },
    email:{
        type:String,
        required:[true,"Email name is required"],
        unique:[true,"Email already existed"]
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    ProfileImageUrl:{
        type:String,
    },
    role:{
        type:String,
        enum:["USER","AUTHOR","ADMIN"],
        required:[true,"{Value} is an Invalid Role"]
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{
    strict:"throw",
    timestamps:true,
    versionKey:false
})
//craete model
export const UserTypeModel=model("user",userSchema)