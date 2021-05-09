import { successResponse, failResponse } from '../../utils/api-utils';
import * as logic from '../../logic';

export default (req, res) => {
    logic.showService(req.params.id)
        .then(service => res.json(successResponse(service)))
        .catch(err => res.json(failResponse(err.message)))
}
