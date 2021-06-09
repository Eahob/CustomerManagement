import { handleHideQueryResponse } from '../../utils/api-utils';
import { deleteCustomer } from '../../logic';

export const handleDeleteCustomer = handleHideQueryResponse(deleteCustomer);
