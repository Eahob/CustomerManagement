import { handleHideQueryResponse } from '../../utils/api-utils';
import { deleteProduct } from '../../logic';

export const handleDeleteProduct = handleHideQueryResponse(deleteProduct);
