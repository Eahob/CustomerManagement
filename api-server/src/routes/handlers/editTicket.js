import { handleUpdateOneQueryResponse } from '../../utils/api-utils';
import { editTicket } from '../../logic';

export default (req, res) => {
	const { customer, services, products } = req.body;

	handleUpdateOneQueryResponse(res, editTicket(customer, services, products, req.params.id));
};
