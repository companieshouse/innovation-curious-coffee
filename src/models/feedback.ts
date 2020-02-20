import mongoose, {Schema, Document} from 'mongoose';

export interface InterfaceFeedback extends Document {
    email: string;
    feedback: string;
}

const FeedbackSchema: Schema = new Schema({
    email: {type: String, required: true},
    feedback: {type: String, required: true}
});

export default mongoose.model<InterfaceFeedback>('Feedback', FeedbackSchema, 'feedback');