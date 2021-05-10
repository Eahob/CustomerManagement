import { handleUpdateOneQueryResponse } from '../../utils/api-utils';
import { editCustomer } from '../../logic';

export default (req, res) => {
	const { name, surname, phone, email, observations } = req.body;
	handleUpdateOneQueryResponse(res, editCustomer(name, surname, phone, email, observations, req.params.id))
}
