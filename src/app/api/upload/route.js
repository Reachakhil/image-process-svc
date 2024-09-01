import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { connectToDatabase, connection } from '../../../lib/mongodb';
import Image from '../../../models/Images';

// Create a directory if it doesn't exist
const ensureDirectoryExistence = (filePath) => {
    const dir = path.dirname(filePath);
    if (fs.existsSync(dir)) {
        return true;
    }
    ensureDirectoryExistence(dir);
    fs.mkdirSync(dir);
};

// Save file to a specific location
const saveFile = async (file) => {
    const data = await file.arrayBuffer();
    const buffer = Buffer.from(data); 
    const filePath = path.join(process.cwd(), 'public/uploads', file.name); 
    ensureDirectoryExistence(filePath); 
    await fs.promises.writeFile(filePath, buffer); 
    return filePath;
};

export const config = {
    api: {
        bodyParser: false, 
    },
};

// Handle POST request
export async function POST(req) {
    await connectToDatabase();

    try {
        const formData = await req.formData(); 
        const file = formData.get('image');

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const savedFilePath = await saveFile(file); 
        console.log({savedFilePath}, file)
        const { originalname, mimetype, size, path: filePath } = file;
        const image = new Image({
            filename: originalname,
            filepath: filePath,
            mimetype: mimetype,
            size: size,
        });

        await image.save();

        return NextResponse.json({ message: 'File uploaded successfully', path: savedFilePath }, { status: 201 });
    } catch (error) {
        console.error("Error during file upload:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}