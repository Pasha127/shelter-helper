import express from "express";
import createHttpError from "http-errors";
import { hostOnly, JWTAuth } from "../../lib/auth/middleware.js";
import { createTokens, refreshTokens } from "../../lib/tools/tokenTools.js";
import { checkUserSchema, checkValidationResult as checkUserValidationResult } from "../validators/uservalidator.js";
import { checkRoomSchema, checkValidationResult as checkRoomValidationResult } from "../validators/roomValidator.js";
import userModel from "../models/userModel.js";


const router = express.Router();


////////////////////////////  USERS  ////////////////////////////

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

router.put("user/login", async (req, res, next) => {
    try {
      const { email, password } = req.body
      const user = await userModel.checkCredentials(email, password);  
      if (user) {
        const { accessToken, refreshToken } = await createTokens(user);
        res.cookie("accessToken", accessToken)
        res.cookie("refreshToken", refreshToken)
        res.status(200).send(user.toObject())
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

  
router.post("user/refreshTokens", async (req, res, next) => {
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


router.get("user/all", JWTAuth, async (req,res,next)=>{
  if(req.newTokens){
    res.cookie("accessToken", req.newTokens.newAccessToken)
    res.cookie("refreshToken", req.newTokens.newRefreshToken)}
    try{
        console.log(req.headers.origin, "GET all users at:", new Date());
        const users = await userModel.find()
          res.status(200).send(users) 
    }catch(error){ 
        next(error)
    }    
})


router.put("user/logout", JWTAuth, async (req,res,next)=>{
    try{
        console.log(req.headers.origin, "GET user at:", new Date());
        /* console.log(req); */
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


router.get("user/me", JWTAuth, async (req,res,next)=>{
  if(req.newTokens){
    res.cookie("accessToken", req.newTokens.newAccessToken)
    res.cookie("refreshToken", req.newTokens.newRefreshToken)}
    try{
        console.log(req.headers.origin, "GET me at:", new Date());
        /* console.log(req); */
        const user = await userModel.find({_id: req.user._id});
        if(user){console.log("found user", user);
        res.status(200).send(user.toObject())}
        else{
          res.redirect(`${process.env.FE_DEV_URL}/`)
          next(createHttpError(404, "User not found"));
        }        
    }catch(error){ 
      console.log("error me")
        next(error)
    }    
})

router.put("user/me", JWTAuth, async (req,res,next)=>{
  if(req.newTokens){
    res.cookie("accessToken", req.newTokens.newAccessToken)
    res.cookie("refreshToken", req.newTokens.newRefreshToken)}
    try{
        console.log(req.headers.origin, "PUT User at:", new Date());
        await userModel.findByIdAndUpdate(req.user._id, {user:
           {...req.body}}, {new:true, runValidators:true});   
     
        res.status(200).send(updatedUser);
        
    }catch(error){ 
        next(error);
    }
})

router.delete("user/me", JWTAuth, async (req,res,next)=>{try{
    console.log(req.headers.origin, "DELETE User at:", new Date());
    const deletedUser =  await userModel.findByIdAndDelete(req.user._id)      
    if(deletedBlogPost){
      res.status(204).send({message:"User has been deleted."})
    }else{
      next(createHttpError(404, "User Not Found"));    
    }
}catch(error){
    next(error)
}
})



router.post("user/new", JWTAuth, checkUserSchema, checkUserValidationResult, async (req,res,next)=>{
  if(req.newTokens){
    res.cookie("accessToken", req.newTokens.newAccessToken)
    res.cookie("refreshToken", req.newTokens.newRefreshToken)}
    try{
      console.log(req.headers.origin, "POST user at:", new Date());
      const newUser = new userModel(req.body);
      const{_id}= await newUser.save();
      
      res.status(201).send({message:`Added a new user.`,_id});
      
    }catch(error){
      next(error);
    }
  })
  
  router.get("user/:userId", JWTAuth, async (req,res,next)=>{
    if(req.newTokens){
      res.cookie("accessToken", req.newTokens.newAccessToken)
      res.cookie("refreshToken", req.newTokens.newRefreshToken)}
      try{
          console.log(req.headers.origin, "GET user at:", new Date());       
          const foundUser = await userModel.findById(req.params.userId)
          if(foundUser){
              res.status(200).send(foundUser);
          }else{next(createHttpError(404, "user Not Found"));
      } 
      }catch(error){
          next(error);
      }
  })
  
  
////////////////////////////  ROOMS  ////////////////////////////



export default router;