import exp from "express"
import { connect } from "mongoose" 
import { config } from "dotenv"
import { userRoute } from "./APIs/UserApi.js"
import { adminRoute } from "./APIs/AdminApi.js"
import { authorRoute } from "./APIs/AuthorApi.js"
import { commonRouter } from "./APIs/CommonApi.js"
import cookieParser from "cookie-parser"
import cors from 'cors'

config()//process.env

//create express application
const app=exp()  //exported by express module
const PORT=process.env.PORT||5000
//use cors middleware
app.use(cors({
  origin: true,
  credentials: true
}))
//add body parser middleware
app.use(exp.json())
//add cookie parser middleware
app.use(cookieParser())
//connect APIs
app.use("/user-api",userRoute)
app.use("/admin-api",adminRoute)
app.use("/author-api",authorRoute)
app.use("/common-api",commonRouter)

//connect to db
const connectDB=async()=>{
    try{
     await connect(process.env.mongodb)
     console.log("Database connection successful")
     //start htp server
     app.listen(process.env.PORT,()=>{
        console.log("Server started")
     })}
     catch(err){
        console.log("Err in DB connection",err)
     }
    }
connectDB()    
//logout for user,author,admin
// app.post("/logout",(Req,res)=>{
//    //clear the cookie named "token"
//    res.clearCookie("token",{
//       httpOnly:true,//must match original settings
//       secure:false,//must match original settings
//       sameSite:"lax"//must match original settings
//    })
//    res.status(200).json({message:"Logged out successfully"})
// })
//err handling middleware
//forwrd the req to next
//if we give "next" only to represent the middleware

//dealing with invalid path
//if none of the path is matched ,it will come here
app.use((req,res,next)=>{
   console.log(req.url)  //path is present in urlpath
   res.json({message:` ${req.url} is Invalid path`})
})
app.use((err,req,res,next)=>{
     console.log("err:",err)
     res.json({message:"error",reason:err.message})
})

app.use((err, req, res, next) => {

  console.log("Error name:", err.name);
  console.log("Error code:", err.code);
  console.log("Full error:", err);

  // mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // mongoose cast error
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error: "${field} ${value} already exists",
    });
  }

  // ✅ HANDLE CUSTOM ERRORS
  if (err.status) {
    return res.status(err.status).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // default server error
  res.status(500).json({
    message: "error occurred",
    error: "Server side error",
  });
});
