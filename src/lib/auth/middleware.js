import createHttpError from "http-errors"
import { verifyAccessToken } from "./tokenTools.js"


export const hostOnly = (req, res, next) => {
    if (req.user.role === "Host") {
      next();
    } else {
      next(createHttpError(403, "Insufficient permission. Access denied."));
    }
}

export const JWTAuth = async (req, res, next) => {
    if (!req.cookies.accessToken) {      
      next(createHttpError(401, "No access token in cookies."))
  } else {
    try {
      const accessToken = req.cookies.accessToken
      const payload = await verifyAccessToken(accessToken)
      req.user = {
        _id: payload._id,
        role: payload.role,
      }
      next()
    } catch (error) {
      
      next(createHttpError(401, "Token invalid!"))
    }
  }
}