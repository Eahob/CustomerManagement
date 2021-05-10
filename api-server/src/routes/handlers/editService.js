import { handleUpdateOneQueryResponse } from '../../utils/api-utils';
import { editService } from '../../logic';

export default (req, res) => {
	const { name, price, tax } = req.body;

	handleUpdateOneQueryResponse(res, editService(name, price, tax, req.params.id));
}
