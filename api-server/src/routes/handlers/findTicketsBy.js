import { handleFindQueryResponse } from '../../utils/api-utils';
import { findTicketsBy } from '../../logic';

export const handleFindTicketsBy = handleFindQueryResponse(findTicketsBy);
