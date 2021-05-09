import { successResponse, failResponse } from '../../utils/api-utils';
import * as logic from '../../logic';

export default (req, res) => {
    logic.showTicket(req.params.id)
        .then(ticket => res.json(successResponse(ticket)))
        .catch(err => res.json(failResponse(err.message)))
}
