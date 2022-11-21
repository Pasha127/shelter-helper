import {Schema, model} from "mongoose";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import {UserDocument, userModel} from "../../lib/tools/types" 

const userDBSchema = new Schema(
    {      
        password: { type: String},
        role: { type: String, required: true, enum: ["host", "guest"], default: "guest"  },
        email: { type: String, required: true },
        refreshToken: { type: String },
        rooms: [{
          type: Schema.Types.ObjectId, ref: "User"  
        }]
    },
    {timestamps: true}
  )
  
  
  userDBSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      if(this.password){
        const hash = await bcrypt.hash(this.password, 11);
        this.password = hash;
      }else{
        next(createHttpError(400, "Validation errors in user request body!", ))
      }
    }    
    next();
  })
  
  userDBSchema.methods.toJSON = function () {
    const user = this.toObject();  
    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;
    delete user.__v;
    delete user.refreshToken;    
    return user;
  }
  
  userDBSchema.static("checkCredentials", async function (email, plainPass) {    
    const user = await this.findOne({ email })     
    if (user) {
      const isMatch = await bcrypt.compare(plainPass, user.password);      
      if (isMatch) {
        return user;
      } else {
        return null;
      }
    } else {
      return null;
    }
  })

  userDBSchema.static("cleanModel", ()=>{})
  

export default model<UserDocument, userModel>("User", userDBSchema);