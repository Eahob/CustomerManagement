import  { successResponse, failResponse } from '../../utils/api-utils';
import * as logic from '../../logic';

export default (req, res) => {
    logic.deleteCustomer(req.params.id)
        .then(customer => res.json(successResponse()))
        .catch(err => res.json(failResponse(err.message)))
}
