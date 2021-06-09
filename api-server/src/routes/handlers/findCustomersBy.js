import { handleFindQueryResponse } from '../../utils/api-utils';
import { findCustomersBy } from '../../logic';

export const handleFindCustomersBy = handleFindQueryResponse(findCustomersBy);
