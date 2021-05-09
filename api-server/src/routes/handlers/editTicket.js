import { successResponse, failResponse } from '../../utils/api-utils';
import * as logic from '../../logic';

export default (req, res) => {
    const { customer, services, products } = req.body
    logic.editTicket(customer, services, products, req.params.id)
        .then(ticket => res.json(successResponse({ id: ticket._id })))
        .catch(err => res.json(failResponse(err.message)))
}
