import  { successResponse, failResponse } from '../../utils/api-utils';
import * as logic from '../../logic';

export default (req, res) => {
    logic.deleteProduct(req.params.id)
        .then(product => res.json(successResponse()))
        .catch(err => res.json(failResponse(err.message)))
}
