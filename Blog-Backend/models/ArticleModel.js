import { Schema,model } from "mongoose";
//Create user comment schema
const userCommentSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    comment:{
        type:String
    }
})
//craete article schema
const articleSchema=new Schema({
    author:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:[true,"Author id required"]
    },
    title:{
     type:String,
     required:[true,"Title is required"]
    },
    category:{
    type:String,
    required:[true,"Title is required"]
    },
    content:{
    type:String,
    required:[true,"Title is required"]
    },
    comments:[userCommentSchema],
    isArticleActive:{
        type:Boolean,
        default:true
    }

},{
    strict:"throw",
    versionKey:false,
    timestamps:true
})
export const ArticleModel=model("article",articleSchema)