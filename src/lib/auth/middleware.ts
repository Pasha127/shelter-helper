import { Middleware } from "express-validator/src/base";
import createHttpError from "http-errors"
import { refreshTokens, verifyAccessToken } from "../tools/tokenTools";
import { isTokenPayload } from "../tools/types";



export const hostOnly: Middleware = (req, res, next) => {
    if (req.user.role === "host") {
      next();
    } else {
      next(createHttpError(403, "Insufficient permission. Access denied."));
    }
}

export const JWTAuth: Middleware = async (req, res, next) => {
    if (!req.cookies?.accessToken) {      
      next(createHttpError(401, "No access token in cookies."))
  } else {
    try {
      const currentAccessToken = req.cookies.accessToken
      const payload = await verifyAccessToken(currentAccessToken)
      if(payload && isTokenPayload(payload)){
      req.user = {
        _id: payload._id,
        role: payload.role,
      }
      next()
      }else{
        const {accessToken, refreshToken} = await refreshTokens(req.cookies.refreshToken)
        const payload = await verifyAccessToken(accessToken)
      req.user = {
        _id: payload._id,
        role: payload.role,
      };
      req.newTokens={
        accessToken,
        refreshToken
      };
      next()}
    } catch (error) {
      
      next(createHttpError(401, "Token invalid!"))
    }
  }
}