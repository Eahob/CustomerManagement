import { handleFindQueryResponse } from '../../utils/api-utils';
import { findCustomersBy } from '../../logic';

export default handleFindQueryResponse(findCustomersBy);
