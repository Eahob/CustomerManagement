import { handleFindQueryResponse } from '../../utils/api-utils';
import { showCustomer } from '../../logic';

export default (req, res) => {
	handleFindQueryResponse(res, showCustomer(req.params.id))
}
