import { successResponse, failResponse } from '../../utils/api-utils';
import * as logic from '../../logic';

export default (req, res) => {
    logic.showProduct(req.params.id)
        .then(product => res.json(successResponse(product)))
        .catch(err => res.json(failResponse(err.message)))
}
