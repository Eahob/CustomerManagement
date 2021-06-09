import { handleHideQueryResponse } from '../../utils/api-utils';
import { deleteService } from '../../logic';

export const handleDeleteService = handleHideQueryResponse(deleteService);
