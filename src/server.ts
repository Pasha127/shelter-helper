import express from "express";
import cors from "cors";
import router from "./api/router/index";
import errorHandler from "./lib/tools/errorHandler";
import passport from "passport";
import cookieParser from "cookie-parser";
/* import googleStrategy from "./authentication/googleAuth"; */

const server = express();

const whitelist = [process.env.FE_DEV_URL]
/* passport.use("google", googleStrategy) */

server.use(cors(/* {origin: whitelist,credentials:true} */))
server.use(cookieParser())
server.use(express.json())
server.use(passport.initialize())
server.use("/", router)
server.use(errorHandler)

export {server}