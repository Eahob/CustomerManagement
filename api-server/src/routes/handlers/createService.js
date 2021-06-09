import { handleSaveQueryResponse } from '../../utils/api-utils';
import { createService } from '../../logic';

export const handleCreateService = handleSaveQueryResponse(createService);
