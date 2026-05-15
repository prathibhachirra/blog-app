import exp from "express"
import { authenticate, register } from "../services/authservice.js"
import { ArticleModel } from "../models/ArticleModel.js"
import { verifyToken } from "../middlewares/verifyToken.js"
import { UserTypeModel } from "../models/UserTypeModel.js"
import upload from "../config/multer.js"
import cloudinary from "../config/cloudinary.js"
import { uploadToCloudinary } from "../config/cloudinaryUpload.js"


export const userRoute=exp.Router()

//Register user
userRoute.post(
        "/users",
        upload.single("ProfileImageUrl"),
        async (req, res, next) => {
        let cloudinaryResult;

            try {
                let userObj = req.body;

                //  Step 1: upload image to cloudinary from memoryStorage (if exists)
                if (req.file) {
                cloudinaryResult = await uploadToCloudinary(req.file.buffer);
                }

                // Step 2: call existing register()
                const newUserObj = await register({
                ...userObj,
                role: "USER",
                ProfileImageUrl: cloudinaryResult?.secure_url,
                });

                res.status(201).json({
                message: "user created",
                payload: newUserObj,
                });

            } catch (err) {

                // Step 3: rollback 
                if (cloudinaryResult?.public_id) {
                await cloudinary.uploader.destroy(cloudinaryResult.public_id);
                }

                next(err); // send to your error middleware
            }

        }
        );
//authenticate user
// userRoute.post("/userAuthenticate",async(req,res)=>{
//     //get user credential object
//     const userCred=req.body
//     //call authenticate service
//     const {token,user}=await authenticate(userCred)
//     //save token as httpOnly cookie
//     res.cookie("token",token,{
//         httpOnly:true,
//         sameSite:"lax",
//         secure:false
//     })
//     //send res
//     res.status(200).json({message:"login success",payload:user})

// })
//get all users
userRoute.get("/users",async(req,res)=>{
    let users=await UserTypeModel.find({isActive:true})
    return res.status(200).json({message:"All Users",payload:users})
})

//read all articles(protected route)
userRoute.get("/articles",verifyToken("USER"),async(req,res)=>{
    let articles=await ArticleModel.find({isArticleActive:true}).populate("comments.user","email firstName")
    return res.status(200).json({message:"All articles",payload:articles})
})

//add comment to an article(protected route)
userRoute.put("/articles",verifyToken("USER"),async(req,res)=>{
    //articleid form params
    const {user,articleId,comment}= req.body
    //check user(req.user)
    if(user!==req.user.userId){
        return res.status(403).json({message:"Forbidden"})

    }
    //find articleby id and update

    let articleWithComment = await ArticleModel.findByIdAndUpdate(
        {articleId,isArticleActive:true},
        { $push: { comments: {user,comment} } },
        { new: true ,runValidators:true}.populate("comments.user","email firstName")
    )
    //if article not found
    if(!articleWithComment){
        return res.status(404).json({message:"Article not found"})
    }

    res.status(200).json({ message: "Comment added", payload: articleWithComment })
})


// next()=====>next middleware
// next(err)---->err handling middleware