import { handleFindQueryResponse } from '../../utils/api-utils';
import { findProductsBy } from '../../logic';

export default (req, res) => {
	const { pricemin, pricemax, name } = req.query;

	handleFindQueryResponse(res, findProductsBy(pricemin, pricemax, name));
};
