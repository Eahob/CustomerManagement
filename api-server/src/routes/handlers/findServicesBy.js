import { handleFindQueryResponse } from '../../utils/api-utils';
import { findServicesBy } from '../../logic';

export const handleFindServicesBy = handleFindQueryResponse(findServicesBy);
