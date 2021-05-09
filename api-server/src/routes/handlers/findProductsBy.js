import  { successResponse, failResponse } from '../../utils/api-utils';
import * as logic from '../../logic';

export default (req, res) => {
    const {pricemin, pricemax, name} = req.query
    logic.findProductsBy(pricemin, pricemax, name)
        .then(products => res.json(successResponse(products)))
        .catch(err => res.json(failResponse(err.message)))
}