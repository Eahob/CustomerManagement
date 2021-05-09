import { successResponse, failResponse } from '../../utils/api-utils';
import * as logic from '../../logic';

export default (req, res) => {
    const { name, price, tax } = req.body
    logic.editProduct(name, price, tax, req.params.id)
        .then(product => res.json(successResponse({ id: product._id })))
        .catch(err => res.json(failResponse(err.message)))
}
