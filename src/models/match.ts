import mongoose, {Schema, Document} from 'mongoose';

interface Person {
    name: string;
    email: string;
    department: string;
}

export interface InterfaceMatch extends Document {
    person_1: Person;
    person_2: Person;
}

const MatchSchema: Schema = new mongoose.Schema({
    person_1 : {
        name: {type: String, required: true},
        email: {type: String, required: true},
        department: {type: String, required: true}
    },
    person_2 : {
        name: {type: String, required: true},
        email: {type: String, required: true},
        department: {type: String, required: true}
    }
});

export default mongoose.model<InterfaceMatch>('Match', MatchSchema, "matches");