import { handleCreateQueryResponse } from '../../utils/api-utils';
import { createTicket } from '../../logic';

export default (req, res) => {
	const { customer, services, products } = req.body;

	handleCreateQueryResponse(res, createTicket(customer, services, products));
};
