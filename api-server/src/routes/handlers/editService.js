import { handleEditQueryResponse } from '../../utils/api-utils';
import { editService } from '../../logic';

export const handleEditService = handleEditQueryResponse(editService);
