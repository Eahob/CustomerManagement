import { handleSaveQueryResponse } from '../../utils/api-utils';
import { createCustomer } from '../../logic';

export const handleCreateCustomer = handleSaveQueryResponse(createCustomer);
