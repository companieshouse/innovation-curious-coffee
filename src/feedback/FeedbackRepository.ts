import FeedbackImpl, { Feedback } from './FeedbackModel';
import logger from '../logger';

export interface FeedbackRepository {
    save(feedback: Feedback): Promise<void>;
}

export default class FeedbackRepositoryImpl implements FeedbackRepository {
    public save = async (feedback: Feedback): Promise<void> => {
        logger.info("Saving feedback");

        const feedbackToSave: Feedback = new FeedbackImpl(feedback);

        await feedbackToSave.save();

        logger.info("Feedback saved");
    };
}
