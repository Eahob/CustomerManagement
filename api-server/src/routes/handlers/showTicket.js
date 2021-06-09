import { handleShowResponse } from '../../utils/api-utils';
import { showTicket } from '../../logic';

export const handleShowTicket = handleShowResponse(showTicket);
