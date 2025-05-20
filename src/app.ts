import express  from "express";
import { createUsersTable } from "./config/db";
import csvToJsonRouter from "./routes/csvToJsonConverterRouter"
import dotenv from "dotenv";
dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use("/", csvToJsonRouter);

// Function to create the users Table if exists
createUsersTable()
app.listen(PORT, ()=>{
    console.log(`Server Started on Port ${PORT}`);
    
})
