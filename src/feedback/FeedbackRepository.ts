import FeedbackImpl, {Feedback} from './FeedbackModel';
import logger from '../logger';

export interface InterfaceFeedbackRepository {
    save(email: string, feedback: string): void;
}

export default class FeedbackRepository implements InterfaceFeedbackRepository {
    public save = (email: string, feedback: string): void => {
        logger.info("Saving feedback");

        const feedbackToSave: Feedback = new FeedbackImpl({
            email: email,
            feedback: feedback
        });

        feedbackToSave.save();

        logger.info("Feedback saved");
    }
}