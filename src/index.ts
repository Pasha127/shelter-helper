import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import { server } from "./server";

const port = process.env.PORT || 3001

if(process.env.MONGO_CONNECTION_URL=== undefined) {
    throw new Error('Monogo Connection URL missing')
}
mongoose.connect(process.env.MONGO_CONNECTION_URL)

mongoose.connection.on("connected",()=>{
  server.listen( port, ()=>{
    console.log("server is connected to Database and is running on port:" , port)
    console.table(listEndpoints(server))
})})

server.on("error", (error)=>
console.log(`Server not running due to ${error}`)
)