import { handleCreateQueryResponse } from '../../utils/api-utils';
import { createCustomer } from '../../logic';

export default (req, res) => {
	const { name, surname, phone, email, observations } = req.body;

	handleCreateQueryResponse(res, createCustomer(name, surname, phone, email, observations));
};
