import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { server } from "../src/server";
import roomModel from "../src/api/models/roomModel";
import userModel from "../src/api/models/userModel";
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

const newRoom = {
  name:"Villa de Example",
  description: "Modern",
  location: "New Example",
  maxGuests: 2
};

const invalidGuest = {
  email: "test@guest.new"
};
const invalidHost = {
  email: "test@host.new"
};


beforeAll(async () => {
  if(process.env.MONGO_TEST_CONNECTION_URL){
  await mongoose.connect(process.env.MONGO_TEST_CONNECTION_URL);
  const host = new userModel(newHost);
  const guest = new userModel(newGuest);
  const room = new roomModel(newRoom);
  await host.save();
  await guest.save();}
  else{throw new Error("No Mongo URL")}
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
  await roomModel.deleteMany();
  await userModel.deleteMany();
  await mongoose.connection.close();
});


