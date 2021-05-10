import { handleFindQueryResponse } from '../../utils/api-utils';
import { findTicketsBy } from '../../logic';

export default (req, res) => {
	const { pricemin, pricemax, datemin, datemax, customerId } = req.query;

	handleFindQueryResponse(res, findTicketsBy(pricemin, pricemax, datemin, datemax, customerId));
};
