import { handleSaveQueryResponse } from '../../utils/api-utils';
import { createUser } from '../../logic';

export const handleCreateUser = handleSaveQueryResponse(createUser);
