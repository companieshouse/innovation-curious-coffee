import mongoose, {Schema, Document} from 'mongoose';

export interface Participant extends Document {
    name: string;
    department: string;
    email: string;
    date_registered: Date;
    verify: boolean;
    matches: [string];
}

const ParticipantSchema: Schema = new Schema({
    name: {type: String, required: true, unique: true},
    department: {type: String, required: true},
    email: {type: String, required: true},
    date_registered: {type: Date, required: true},
    verify: {type: Boolean, required: true},
    matches: {type: [String]}
});

ParticipantSchema.statics.getAllVerifiedParticipants = async function(): Promise<Participant> {
    return this.find({verify: true})
            .collation({ locale: "en" })
            .sort({email: 1});
};

export default mongoose.model<Participant>('Participant', ParticipantSchema, "people");