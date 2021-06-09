import { handleFindQueryResponse } from '../../utils/api-utils';
import { findProductsBy } from '../../logic';

export const handleFindProductsBy = handleFindQueryResponse(findProductsBy);
