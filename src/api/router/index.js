import express from "express";
import multer from "multer"; 
import passport from "passport";
import createHttpError from "http-errors";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { hostOnly, JWTAuth } from "../../lib/auth/middleware.js";
import { createTokens, refreshTokens } from "../../lib/tools/tokenTools.js";
import { checkUserSchema, checkValidationResult as checkUserValidationResult } from "../validators/uservalidator.js";
import { checkRoomSchema, checkValidationResult as checkRoomValidationResult } from "../validators/roomValidator.js";
import userModel from "../models/userModel.js";


const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary, 
    params: {folder: "BlogPics"},
  }),
  limits: { fileSize: 1024 * 1024 },
}).single("image")

const blogPostRouter = express.Router();

const router = express.Router();

/* router.get("/googleLogin", passport.authenticate("google",{scope:["email","profile"]})) */

/* router.get("/googleRedirect", passport.authenticate("google",{session: false}), async (req, res, next) => {

  try {
    const {accessToken,refreshToken} = req.user
    res.cookie("accessToken",accessToken,{"httpOnly":true});
    res.cookie("refreshToken",refreshToken,{"httpOnly":true});
    res.redirect(`${process.env.FE_DEV_URL}/`/* ?loginSuccessful=true *//* );
  }catch(error){
    console.log(error)
      next(error);
  }   
}) */

/* router.get("/facebookLogin", passport.authenticate('facebook')) */

/* router.get("/facebookRedirect", passport.authenticate('facebook',{failureRedirect: `${process.env.FE_DEV_URL}/`,session: false}), async (req, res, next) => {
console.log("redirectedFB")
  try {
    const {accessToken,refreshToken} = req.user
    res.cookie("accessToken",accessToken,{"httpOnly":true});
    res.cookie("refreshToken",refreshToken,{"httpOnly":true});
    res.redirect(`${process.env.FE_DEV_URL}/`/* ?loginSuccessful=true *//* );
  }catch(error){
    console.log(error)
      next(error);
  }   
}) */

router.post("user/register", async (req, res, next) => {
    try {
        console.log(req.headers.origin, "POST user at:", new Date());        
        const newUser = new userModel(req.body);
        const{_id}= await newUser.save();
        if (_id) {
            const { accessToken, refreshToken } = await createTokens(newUser);
            res.cookie("accessToken", accessToken);
            res.cookie("refreshToken", refreshToken);
            res.status(201).send({...newUser, _id});
          } else {
            console.log("Error in returned registration");
            next(createHttpError(500, `Registration error`));
        }
    }catch(error){
        console.log("Error in registration", error);
        next(error);
    }   
  })

router.post("/login", async (req, res, next) => {
    try {
      const { email, password } = req.body
      const user = await userModel.checkCredentials(email, password);  
      if (user) {
        const { accessToken, refreshToken } = await createTokens(user);
        res.cookie("accessToken", accessToken)
        res.cookie("refreshToken", refreshToken)
        res.status(200).send({...user.toObject()})
/*         res.redirect(`${process.env.FE_DEV_URL}/`) */
      } else {
        res.redirect(`${process.env.FE_DEV_URL}/`)
        next(createHttpError(401, `Credentials did not match or user not found.`))
      }
    } catch (error) {
        console.log("Error in log in")
      next(error)
    }
  })

///////////////
  
router.post("/refreshTokens", async (req, res, next) => {
    try {
      const { currentRefreshToken } = req.body   
      const { accessToken, refreshToken } = await refreshTokens(currentRefreshToken)
      res.cookie("accessToken", accessToken)
      res.cookie("refreshToken", refreshToken)
      res.status(201).send({message: "refreshed tokens"})
    } catch (error) {
      next(error)
    }
  })
  


router.get("/", JWTAuth, async (req,res,next)=>{
    try{
        console.log(req.headers.origin, "GET user at:", new Date());
        const users = await userModel.find()
        res.status(200).send(users)        
    }catch(error){ 
        next(error)
    }    
})

router.get("/me", JWTAuth, async (req,res,next)=>{
    try{
        console.log(req.headers.origin, "GET user at:", new Date());
        console.log(req);
        const user = await userModel.find({_id: req.user._id});
        if(user){console.log("found user", user)
        res.status(200).send(user)}
        else{
          res.redirect(`${process.env.FE_DEV_URL}/`)
          next(createHttpError(404, "User not found"));
        }        
    }catch(error){ 
      console.log("error me")
        next(error)
    }    
})
router.get("/logout", JWTAuth, async (req,res,next)=>{
    try{
        console.log(req.headers.origin, "GET user at:", new Date());
        console.log(req);
        const user = await userModel.find({_id: req.user._id});
        if(user){console.log("found user", user)
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        res.redirect(`${process.env.FE_DEV_URL}/`)}
        else{
          next(createHttpError(404, "User not found"));
        }        
    }catch(error){ 
      console.log("error me")
        next(error)
    }    
})

router.get("/:userId", JWTAuth, adminOnly, async (req,res,next)=>{
    try{
        console.log(req.headers.origin, "GET user at:", new Date());       
        const foundUser = await userModel.findById(req.params.user)
        if(foundUser){
            res.status(200).send(foundUser);
        }else{next(createHttpError(404, "user Not Found"));
    } 
    }catch(error){
        next(error);
    }
})


router.post("/", JWTAuth, checkUserSchema, checkValidationResult, adminOnly, async (req,res,next)=>{
    try{
        console.log(req.headers.origin, "POST user at:", new Date());
        const newUser = new userModel(req.body);
        const{_id}= await newUser.save();

        res.status(201).send({message:`Added a new user.`,_id});
        
    }catch(error){
        next(error);
    }
})



router.post("/images/:userId/avatar", cloudinaryUploader, async (req,res,next)=>{try{
     console.log("tried to post an avatar", req.file.path);
     await userModel.findByIdAndUpdate(req.params.userId, {user: {avatar: req.file.path}}, {new:true, runValidators:true});   
        
    res.status(201).send({message: "Avatar Uploaded"});
 }catch(error){console.log(error)}}); 




router.put("/:userId", JWTAuth, adminOnly, async (req,res,next)=>{
    try{
        console.log(req.headers.origin, "PUT post at:", new Date());
        await userModel.findByIdAndUpdate(req.params.userId, {user:
           {...req.body}}, {new:true, runValidators:true});   
     
        res.status(200).send(updatedUser);
        
    }catch(error){ 
        next(error);
    }
})


router.delete("/:userId", JWTAuth, adminOnly, async (req,res,next)=>{try{
    console.log(req.headers.origin, "DELETE post at:", new Date());
    const deletedUser =  await userModel.findByIdAndDelete(req.params.userId)      
    if(deletedBlogPost){
      res.status(204).send({message:"blogPost has been deleted."})
    }else{
      next(createHttpError(404, "Blogpost Not Found"));    
    }
}catch(error){
    next(error)
}
})




export default router;