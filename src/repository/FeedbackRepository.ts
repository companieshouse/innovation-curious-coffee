import Feedback, {InterfaceFeedback} from '../models/feedback';
import logger from '../logger';

export interface InterfaceFeedbackRepository {
    save(email: string, feedback: string): void;
}

export default class FeedbackRepository implements InterfaceFeedbackRepository {
    public save = (email: string, feedback: string): void => {
        logger.info("Saving feedback");

        const feedbackToSave: InterfaceFeedback = new Feedback({
            email: email,
            feedback: feedback
        });

        feedbackToSave.save();

        logger.info("Feedback saved");
    }
}