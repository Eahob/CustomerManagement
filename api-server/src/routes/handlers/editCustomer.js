import { handleEditQueryResponse } from '../../utils/api-utils';
import { editCustomer } from '../../logic';

export const handleEditCustomer = handleEditQueryResponse(editCustomer);
