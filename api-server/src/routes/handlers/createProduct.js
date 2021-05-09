import { successResponse, failResponse } from '../../utils/api-utils';
import * as logic from '../../logic';

export default (req, res) => {
    const { name, price, tax } = req.body
    logic.createProduct(name, price, tax)
        .then(product => res.json(successResponse({ id: product._id })))
        .catch(err => res.json(failResponse(err.message)))
}
