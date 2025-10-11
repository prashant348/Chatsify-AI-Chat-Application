import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_DEV_URI}/Chatsify`)
        console.log("Connected to DB!")
    } catch(err) {
        console.error("error in connecting db: ", err)
        process.exit(1)
    }
}
