import { handleDeleteQueryResponse } from '../../utils/api-utils';
import { deleteProduct } from '../../logic';

export default (req, res) => {
	handleDeleteQueryResponse(res, deleteProduct(req.params.id));
}
