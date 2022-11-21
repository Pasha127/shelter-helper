import createHttpError from "http-errors"
import jwt from "jsonwebtoken"
import { Document, ObjectId } from "mongoose";
import userModel from "../../api/models/userModel";
import {UserDocument, TokenPayload, RefreshTokenPayload} from "./types"
import {VerificationFailure} from './types'


export const createTokens = async(user:UserDocument) => {
  const accessToken = await createAccessToken({ _id: user._id, role: user.role, type:'token' });
  const refreshToken = await createRefreshToken({ _id: user._id, type:'token' });
  if(refreshToken){
  user.refreshToken = refreshToken;  //<-------- Show Aron
  await user.save();}


  return { accessToken, refreshToken }
}

const createAccessToken = (payload:TokenPayload): Promise<string > =>
  new Promise(function (res, rej) {
    jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "5m" }, (err, token) => {
      if (err) rej(err);
      else res(token as string);
    })
  }
  )

export const verifyAccessToken = (accessToken:string): Promise<TokenPayload | undefined | VerificationFailure> =>
  new Promise((res, rej) =>
    jwt.verify(accessToken, process.env.JWT_SECRET!, (err, originalPayload) => {
      if (err) res({result: "fail", type:'error'});
      else res(originalPayload as TokenPayload);
    })
  )

const createRefreshToken = (payload:TokenPayload):Promise<string|undefined> =>
  new Promise((res, rej) => {
    jwt.sign(payload, process.env.REFRESH_SECRET!, { expiresIn: "1d" }, (err, token) => {
      if (err) rej(err);
      else res(token);
    })
  }
  )

const verifyRefreshToken = (refreshToken: string): Promise<RefreshTokenPayload> =>
  new Promise((res, rej) =>
    jwt.verify(refreshToken, process.env.REFRESH_SECRET!, (err, originalPayload) => {
      if (err) rej(err);
      else res(originalPayload as RefreshTokenPayload);
    })
  )

export const refreshTokens = async (currentRefreshToken: string) => {
  if(!currentRefreshToken){ throw new (createHttpError as any)(401, "Refresh token invalid!")}
  try {    
    const refreshTokenPayload = await verifyRefreshToken(currentRefreshToken);
    const user = await userModel.findById(refreshTokenPayload._id);
    if (!user) throw new (createHttpError as any)(404, `User with id ${refreshTokenPayload._id} not found!`);
    if (user.refreshToken && user.refreshToken === currentRefreshToken) {
      const { accessToken, refreshToken } = await createTokens(user)
      return { accessToken, refreshToken }
    } else {
      throw new (createHttpError as any)(401, "Refresh token invalid!")
    }
  } catch (error) {
    throw new (createHttpError as any)(401, "Refresh token invalid! 2")
  }
}