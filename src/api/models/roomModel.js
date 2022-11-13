import {Schema, model} from "mongoose";

const roomDBSchema = new Schema(
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      location: { type: Number, required: true },
      maxGuests: { type: String, required: true },
      hosts: {
        type: Schema.Types.ObjectId, ref: "User" 
        }
    },
    {timestamps: true}
  )
  
  export default model("BlogPost",roomDBSchema)