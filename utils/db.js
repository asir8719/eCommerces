import mongoose from 'mongoose'

const URI = process.env.DB_URI
const connectDb = async () =>{
    try {
        await mongoose.connect(URI)
        console.log('connection successful to Db');
    } catch (error) {
        console.error("database connection failed");
        process.exit(0)
    }
}

export {connectDb}
