import mongoose from "mongoose";
import dotenv from 'dotenv';


dotenv.config();

export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://bisigoodluck:24SSWia3H4iFNCgL@clustertechnotronix.yxle6pl.mongodb.net/feast2').then (() => console.log("DB Connected"));
}

export const FIXED_PASSWORD = 'food12345delivery';
export const JWT_SECRET = process.env.JWT_SECRET || "random#secret";