import mongoose from "mongoose";


type ConnectionSchema = {
    isConnected?: number
}

const connection: ConnectionSchema = {}

export async function connectToDb(): Promise<void> {
    if (connection.isConnected) {
        console.log('Database already connected')
        return;
    }
    try {
        const db=await mongoose.connect(process.env.MONGODB_URI || '',{})

        connection.isConnected=db.connections[0].readyState
        console.log('MONGODB connected successfully')

    } catch (error) {
        console.log('Error', error);
        process.exit(1)
    }
}