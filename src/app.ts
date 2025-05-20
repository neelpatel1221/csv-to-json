import express  from "express";
import { createUsersTable } from "./config/db";
import csvToJsonRouter from "./routes/csvToJsonConverterRouter"
const app = express()

app.use(express.json())
app.use("/", csvToJsonRouter);

// Function to create the users Table if exists
createUsersTable()
app.listen(3000, ()=>{
    console.log("Server Started on Port 3000");
    
})
