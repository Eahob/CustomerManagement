import { handleShowResponse } from '../../utils/api-utils';
import { showCustomer } from '../../logic';

export const handleShowCustomer = handleShowResponse(showCustomer);
