import { handleFindQueryResponse } from '../../utils/api-utils';
import { findProductsBy } from '../../logic';

export default handleFindQueryResponse(findProductsBy);
