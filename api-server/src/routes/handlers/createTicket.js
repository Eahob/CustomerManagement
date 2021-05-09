import { successResponse, failResponse } from '../../utils/api-utils';
import * as logic from '../../logic';

export default (req, res) => {
    const { customer, services, products } = req.body
    logic.createTicket(customer, services, products)
        .then(ticket => res.json(successResponse({ id: ticket._id })))
        .catch(err => res.json(failResponse(err.message)))
}
