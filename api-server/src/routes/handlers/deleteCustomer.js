import { handleDeleteQueryResponse } from '../../utils/api-utils';
import { deleteCustomer } from '../../logic';

export default (req, res) => {
	handleDeleteQueryResponse(res, deleteCustomer(req.params.id))
}
