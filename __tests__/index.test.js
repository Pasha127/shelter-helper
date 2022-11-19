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

const invalidGuest = {
  email: "test@guest.new"
};
const invalidHost = {
  email: "test@host.new"
};


beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_CONNECTION_URL);
  const host = new userModel(newHost);
  const guest = new userModel(newGuest);
  await host.save();
  await guest.save();
});


describe("Test Products APIs", () => {
  let hostID ="";
  let guestID ="";
  let returnedGuest=null;
  let returnedHost=null;

    it("Should check that Mongo connection string is not undefined", () => {
        expect(process.env.MONGO_TEST_CONNECTION_URL).toBeDefined();
    });
    
    it("Should test that GET /users returns a success status and a body", async () => {
        const response = await client.get("/users").expect(200);
        console.log(response.body);
    });    
   
})

afterAll(async () => {
  await productModel.deleteMany();
  await mongoose.connection.close();
});


