import express, { Request, Response } from "express";
import path from  "path";
import { parseCsvToJson } from "../helpers/commonHelper";
import { insertUsers, printAgeDistribution } from "../config/db";
const router = express.Router()

// GET endpoint to convert CSV to JSON, insert into DB, and print age distribution to the console
router.get('/csv_to_json', async (req: Request, res: Response)=>{
    try {
        const csvFilePath = path.resolve(process.env.CSV_PATH!);
        const records = await parseCsvToJson(csvFilePath);
        await insertUsers(records)
        await printAgeDistribution()
        res.send(records);
        
    } catch (error) {
        console.log(error);
        
    }
})
export default router