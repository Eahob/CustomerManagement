import { handleUpdateOneQueryResponse } from '../../utils/api-utils';
import { editProduct } from '../../logic';

export default (req, res) => {
	const { name, price, tax } = req.body;
	handleUpdateOneQueryResponse(res, editProduct(name, price, tax, req.params.id));
}
