import mongoose from 'mongoose';

const connection = {};

async function connectToDatabase() {
    if (connection.isConnected) {
        console.log('Already connected to MongoDB');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        connection.isConnected = db.connections[0].readyState === 1;
        console.log('Connected to MongoDB:', connection.isConnected);
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        connection.isConnected = false;
    }
}

export { connectToDatabase, connection };