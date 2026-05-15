import exp from "express"
import { register,authenticate } from "../services/authservice.js"
import { UserTypeModel } from "../models/UserTypeModel.js"
import {ArticleModel} from "../models/ArticleModel.js"
import { checkAuthor } from "../middlewares/checkAuthor.js"
import { verifyToken } from "../middlewares/verifyToken.js"
import upload from "../config/multer.js"
import cloudinary from "../config/cloudinary.js"
import { uploadToCloudinary } from "../config/cloudinaryUpload.js"

export const authorRoute=exp.Router()


//Register author(public)
authorRoute.post(
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
                role: "AUTHOR",
                ProfileImageUrl: cloudinaryResult?.secure_url,
                });

                res.status(201).json({
                message: "author created",
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


//authenticate author(public)
// authorRoute.post("/userAuthenticate",async(req,res)=>{
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


//create article(protected)
authorRoute.post("/articles",verifyToken("AUTHOR"),async(req,res)=>{
    //get article from req
    const newArticle=req.body
    //set author from token
    newArticle.author = req.user.userId
    //create article document
    const articleDoc=new ArticleModel(newArticle)
    //save
    let createdArticleDoc=await articleDoc.save()
    //send res
    return res.status(201).json({message:"Article created",payload:createdArticleDoc})
})

//read articles of author(protected)
authorRoute.get("/articles/:authorId",verifyToken("AUTHOR"),async(req,res)=>{
    //get author id
     const aid=req.params.authorId
    // //check the author
     const author=await UserTypeModel.findById(aid)
    // if(!author || author.role!=="AUTHOR")
    //     return res.status(401).json({message:"Invalid author"})
    //read articles by this author which are active
    const articles=await ArticleModel.find({author:aid,isArticleActive:true}).populate("author","firstName")
    //send res
    res.status(200).json({message:"articles",payload:articles})
})

authorRoute.get("/articles",async(req,res)=>{
    
    const articles=await ArticleModel.find()
    //send res
    res.status(200).json({message:"articles",payload:articles})
})

//get single article by id
authorRoute.get("/articles/:id",async(req,res)=>{
    const id = req.params.id
    const article = await ArticleModel.findById(id).populate("author","firstName lastName email")
    if(!article) return res.status(404).json({ message: "Article not found" })
    res.status(200).json({message:"article",payload:article})
})



//edit article(protected route)
authorRoute.put("/articles", verifyToken("AUTHOR"), async (req, res) => {
  console.log(req.body);
  let author = req.user.userId;
  //get modified article from req
  let { articleId, title, category, content } = req.body;
  console.log(articleId, author);
  //find article
  let articleOfDB = await ArticleModel.findOne({ _id: articleId, author: author });
  console.log(articleOfDB);
  if (!articleOfDB) {
    return res.status(401).json({ message: "Article not found" });
  }

  //update the article
  let updatedArticle = await ArticleModel.findByIdAndUpdate(
    articleId,
    {
      $set: { title, category, content },
    },
    { new: true },
  );
  //send res(updated article)
  res.status(200).json({ message: "article updated", payload: updatedArticle });
});



//delete(soft delete) article(Protected route)
authorRoute.patch("/articles/:id/status", verifyToken("AUTHOR"), async (req, res) => {
  const { id } = req.params;
  const { isArticleActive } = req.body;
  // Find article
  const article = await ArticleModel.findById(id); //.populate("author");
  //console.log(article)
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  //console.log(req.user.userId,article.author.toString())
  // AUTHOR can only modify their own articles
  if (req.user.role === "AUTHOR" && 
    article.author.toString() !== req.user.userId) {
    return res
    .status(403)
    .json({ message: "Forbidden. You can only modify your own articles" });
  }
  // Already in requested state
  if (article.isArticleActive === isArticleActive) {
    return res.status(400).json({
      message: `Article is already ${isArticleActive ? "active" : "deleted"}`,
    });
  }

  //update status
  article.isArticleActive = isArticleActive;
  await article.save();

  //send res
  res.status(200).json({
    message: `Article ${isArticleActive ? "restored" : "deleted"} successfully`,
    article,
  });
});

