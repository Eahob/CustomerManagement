import { handleFindQueryResponse } from '../../utils/api-utils';
import { findCustomersBy } from '../../logic';

export default (req, res) => {
	const { name, surname, phone, email, observations } = req.query
	handleFindQueryResponse(res, findCustomersBy(name, surname, phone, email, observations));
};
