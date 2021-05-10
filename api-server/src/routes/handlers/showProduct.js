import { handleFindQueryResponse } from '../../utils/api-utils';
import { showProduct } from '../../logic';

export default (req, res) => {
	handleFindQueryResponse(res, showProduct(req.params.id))
}
