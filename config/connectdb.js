import mongoose from "mongoose";

DATABASE_URL="mongodb+srv://Amit_MongoDB:Mynameis0@cluster0.0alpo.mongodb.net/NM"

    const connectDB = async (DATABASE_URL)=>{
        try {
            const DB_OPTIONS={
                dbName:"geekshop"
            }
            await mongoose.connect(DATABASE_URL,DB_OPTIONS)
            console.log("connected to DB");
        } catch (error) {
            
        }
    }
    export default connectDB;