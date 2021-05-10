import { handleDeleteQueryResponse } from '../../utils/api-utils';
import { deleteTicket } from '../../logic';

export default (req, res) => {
	handleDeleteQueryResponse(res, deleteTicket(req.params.id));
};
