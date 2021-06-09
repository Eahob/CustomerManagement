import { handleSaveQueryResponse } from '../../utils/api-utils';
import { createProduct } from '../../logic';

export const handleCreateProduct = handleSaveQueryResponse(createProduct);
