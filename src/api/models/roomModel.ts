import {Schema, model} from "mongoose";

const roomDBSchema = new Schema(
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      location: { type: String, required: true },
      maxGuests: { type: Number, required: true },
      hosts: [
        {type: Schema.Types.ObjectId, ref: "User" }
      ]
    },
    {timestamps: true}
  )
  
  export default model("Room",roomDBSchema)