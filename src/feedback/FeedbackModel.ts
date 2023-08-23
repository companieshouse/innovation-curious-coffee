import mongoose, { Schema, Document } from 'mongoose';

export interface Feedback extends Document {
    email: string;
    feedback: string;
}

const FeedbackSchema: Schema = new Schema({
    email: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    }
});

export default mongoose.model<Feedback>('Feedback', FeedbackSchema, 'feedback');
