import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
    filename: String,
    filepath: String,
    mimetype: String,
    size: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Image || mongoose.model('Image', ImageSchema);