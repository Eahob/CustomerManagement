import { handleShowResponse } from '../../utils/api-utils';
import { showProduct } from '../../logic';

export const handleShowProduct = handleShowResponse(showProduct);
