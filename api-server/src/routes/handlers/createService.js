import { handleCreateQueryResponse } from '../../utils/api-utils';
import { createService } from '../../logic';

export default (req, res) => {
	const { name, price, tax } = req.body;

	handleCreateQueryResponse(res, createService(name, price, tax));
};
