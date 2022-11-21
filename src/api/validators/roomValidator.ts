import { checkSchema, validationResult,Schema } from "express-validator";
import createHttpError from "http-errors";
import {RequestHandler} from "express";

const roomSchema: Schema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Name is a mandatory field and needs to be a string!",
    }
  },
  description: {
    in: ["body"],
    isString: {
      errorMessage: "Description is a mandatory field and needs to be a string!",
    }
  },  
  maxGuests: {
    in: ["body"],
    isInt: {
      errorMessage: "Max guests is a mandatory field and needs to be a string!",
    }
  },  
  location: {
    in: ["body"],
    isString: {
      errorMessage: "Location is a mandatory field and needs to be a string!",
    }
  }  
}


interface checkValidationResult extends RequestHandler {}

export const checkRoomSchema = checkSchema(roomSchema) 
export const checkValidationResult:checkValidationResult = (req, res, next) => { 
  const errors = validationResult(req)
  if (!errors.isEmpty()) {   
    next(
      createHttpError(400, "Validation errors in room request body!", {
        errorsList: errors.array(),
      })
    );
    console.log("400 in room validator", errors); //<--- DELETE LATER
  } else {
    next()
  }
}