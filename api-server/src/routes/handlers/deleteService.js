import { handleDeleteQueryResponse } from '../../utils/api-utils';
import { deleteService } from '../../logic';

export default (req, res) => {
	handleDeleteQueryResponse(res, deleteService(req.params.id));
};
