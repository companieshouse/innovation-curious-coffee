import FeedbackImpl, {Feedback} from './FeedbackModel';
import logger from '../logger';

export interface InterfaceFeedbackRepository {
    save(feedback: Feedback): void;
}

export default class FeedbackRepository implements InterfaceFeedbackRepository {
    public save = (feedback: Feedback): void => {
        logger.info("Saving feedback");

        const feedbackToSave: Feedback = new FeedbackImpl(feedback);

        feedbackToSave.save();

        logger.info("Feedback saved");
    }
}