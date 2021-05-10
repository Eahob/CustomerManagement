import { handleFindQueryResponse } from '../../utils/api-utils';
import { findTicketsBy } from '../../logic';

export default handleFindQueryResponse(findTicketsBy);
