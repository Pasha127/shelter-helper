import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import router from "././api/router/index.js";
import errorHandler from "./lib/tools/errorHandler.js";
import mongoose from "mongoose";
import passport from "passport";
import cookieParser from "cookie-parser";
/* import googleStrategy from "./authentication/googleAuth.js"; */

const server = express();
const port = process.env.PORT || 3001
const whitelist = [process.env.FE_DEV_URL]
/* passport.use("google", googleStrategy) */

server.use(cors(/* {origin: whitelist,credentials:true} */))
server.use(cookieParser())
server.use(express.json())
server.use(passport.initialize())
server.use("/", router)
server.use(errorHandler)

mongoose.connect(process.env.MONGO_CONNECTION_URL)

mongoose.connection.on("connected",()=>{
  server.listen( port, ()=>{
    console.log("server is connected to Database and is running on port:" , port)
    console.table(listEndpoints(server))
})})

server.on("error", (error)=>
console.log(`Server not running due to ${error}`)
)