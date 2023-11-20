 import dotenv from 'dotenv';
import express from "express";
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js'

// import connectDB from './config/connectdb.js'
dotenv.config();

const app=express();
const port=process.env.PORT;
// const DATABASE_URL=process.env.url;

// connectDB();

mongoose.connect('mongodb://127.0.0.1:27017/NM')
// mongoose.connect("mongodb+srv://Amit_MongoDB:Mynameis0@cluster0.0alpo.mongodb.net/Facebook")
  .then(() => console.log('DB Atlas is Connected!'));

app.use(cors());
app.use(express.json());

//Load Routes
app.use("/api/user",userRoutes)




app.listen(8000,()=>{
    console.log(`server is running at http://localhost:${port}`);
})