import { handleHideQueryResponse } from '../../utils/api-utils';
import { deleteTicket } from '../../logic';

export const handleDeleteTicket = handleHideQueryResponse(deleteTicket);
