import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import server from "../src/server.js";
import roomModel from "../src/api/models/roomModel.js";
import userModel from "../src/api/models/userModel.js";
dotenv.config();
const client = supertest(server);

const newGuest = {
  role: "guest",
  email: "test@guest.new"
};

const newHost = {
  role: "host",
  email: "test@host.new"
};

let hostID ="";
let guestID ="";
let returnedGuest=null;
let returnedHost=null;


const invalidGuest = {
  email: "test@guest.new"
};
const invalidHost = {
  email: "test@host.new"
};


beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_CONNECTION_URL);
  const product = new productModel(newProduct);
  await product.save();
});


describe("Test Products APIs", () => {
  let validProductId = null
    it("Should check that Mongo connection string is not undefined", () => {
        expect(process.env.MONGO_TEST_CONNECTION_URL).toBeDefined();
    });
    
    it("Should test that GET /products returns a success status and a body", async () => {
        const response = await client.get("/products").expect(200);
        console.log(response.body);
    });    
   
})

afterAll(async () => {
  await productModel.deleteMany();
  await mongoose.connection.close();
});




/* describe("Testing the library", () => {
    it("Should test that true is true", () => {
      expect(true).toBe(true)
    })
  
    it("Should test that true is true", () => {
      expect(true).toBe(true)
    })
  
    it("null", () => {
      const n = null
      expect(n).toBeNull()
      expect(n).toBeDefined()
      expect(n).not.toBeUndefined()
      expect(n).not.toBeTruthy()
      expect(n).toBeFalsy()
    })
  
    it("Should test that 2 plus 2 is 4", () => {
      expect(2 + 2).toBe(4)
    })
  })
  
  describe("Testing inside another describe function", () => {
    it("Should test that false is false", () => {
      expect(false).toBe(false)
    })
  }) */

  // By default jest does not work with the new import syntax
// We should add NODE_OPTIONS=--experimental-vm-modules to the package.json (test script) to enable that
// ON WINDOWS YOU HAVE TO USE CROSS-ENV PACKAGE TO BE ABLE TO PASS ENV VARS TO COMMAND LINE SCRIPTS!!


