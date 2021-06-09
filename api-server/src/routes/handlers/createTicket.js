import { handleSaveQueryResponse } from '../../utils/api-utils';
import { createTicket } from '../../logic';

export const handleCreateTicket = handleSaveQueryResponse(createTicket);
