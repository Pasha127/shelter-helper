import UserDocument from './types'

declare global {
  namespace Express {
    interface Request {
      newTokens?: {
        newRefreshToken: string;
        newAccessToken: string;
      }      
  }
  interface User {
    _id?:string
  }
}
}

export {};
