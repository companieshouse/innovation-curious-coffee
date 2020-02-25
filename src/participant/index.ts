import ParticipantService from './ParticipantService';
import ParticipantRepositoryImpl from './ParticipantRepository';

const participantService = new ParticipantService(new ParticipantRepositoryImpl());

export default participantService;