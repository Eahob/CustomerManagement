import { handleCreateQueryResponse } from '../../utils/api-utils';
import { createProduct } from '../../logic';

export default (req, res) => {
	const { name, price, tax } = req.body;
	handleCreateQueryResponse(res, createProduct(name, price, tax));
}
