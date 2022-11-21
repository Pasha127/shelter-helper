import {Model,Document, ObjectId} from "mongoose";
import{RequestHandler} from "express"

export interface TokenizedRequest extends RequestHandler{
    newTokens: {
        newRefreshToken: string,
        newAccessToken: string
    }
}

export interface userModel extends Model<UserDocument>{
    checkCredentials(email: string, plainPass: string ): Promise<UserDocument | null>
}

export interface TokenPayload{
    type:'token'
    _id: ObjectId,
    role?: "guest" | "host"
  }

  export interface VerificationFailure{
    type:'error'
    result:"fail"
  }

  export function isTokenPayload (payload:TokenPayload|VerificationFailure) {
    if (payload.type === 'token') {
        return true
    } else {
       return false
    }
  }
  
export interface RefreshTokenPayload{
    _id: ObjectId
  }
  
  export interface User { 
    _id?:any
    role: "guest" | "host"
    email?: string
    refreshToken?: string
    rooms?: ObjectId[]
  }

  export interface UserDocument extends User, Document{}