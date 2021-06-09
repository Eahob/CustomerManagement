import { handleEditQueryResponse } from '../../utils/api-utils';
import { editTicket } from '../../logic';

export const handleEditTicket = handleEditQueryResponse(editTicket);
