import Feedback, {InterfaceFeedback} from '../models/feedback';

export interface InterfaceFeedbackRepository {
    save(email: string, feedback: string): void;
}

export default class FeedbackRepository implements InterfaceFeedbackRepository {
    save(email: string, feedback: string): void {
        const feedbackToSave: InterfaceFeedback = new Feedback({
            email: email,
            feedback: feedback
        });

        feedbackToSave.save();
    }
}