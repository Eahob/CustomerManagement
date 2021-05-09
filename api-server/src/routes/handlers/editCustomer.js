import { successResponse, failResponse } from '../../utils/api-utils';
import * as logic from '../../logic';

export default (req, res) => {
    const { name, surname, phone, email, observations } = req.body
    logic.editCustomer(name, surname, phone, email, observations, req.params.id)
        .then(customer => res.json(successResponse({ id: customer._id })))
        .catch(err => res.json(failResponse(err.message)))
}
