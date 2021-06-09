import { handleEditQueryResponse } from '../../utils/api-utils';
import { editProduct } from '../../logic';

export const handleEditProduct = handleEditQueryResponse(editProduct);
