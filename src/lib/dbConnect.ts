import mongoose from "mongoose";


type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

// void in typescript means मुझे परवाह नहीं है कि किस तरह का डाटा रिटर्न आ रहा है
// I don't care about what kind of data is being returned
async function dbConnect(): Promise<void> {
    // if the request is raised, & we already hav connection to DB
    if (connection.isConnected) {
        console.log("Already connected to database");
        return
    }

    // now if its not connected
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {}) //connect(url)
        connection.isConnected = db.connections[0].readyState
        console.log(db.connections[0])
        console.log("DB Connected Successfulyy");
    } catch (error) {
        console.log("Database connection failed", error)
        process.exit(1)
    }
}

export default dbConnect;