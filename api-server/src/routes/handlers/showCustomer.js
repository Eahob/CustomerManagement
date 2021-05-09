import { successResponse, failResponse } from '../../utils/api-utils';
import * as logic from '../../logic';

export default (req, res) => {
    logic.showCustomer(req.params.id)
        .then(customer => res.json(successResponse(customer)))
        .catch(err => res.json(failResponse(err.message)))
}
