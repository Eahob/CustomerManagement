import { handleFindQueryResponse } from '../../utils/api-utils';
import { findServicesBy } from '../../logic';

export default (req, res) => {
	const { pricemin, pricemax, name } = req.query;

	handleFindQueryResponse(res, findServicesBy(pricemin, pricemax, name));
};
