import { successResponse, failResponse } from '../../utils/api-utils';
import * as logic from '../../logic';

export default (req, res) => {
    const { name, price, tax } = req.body
    logic.editService(name, price, tax, req.params.id)
        .then(service => res.json(successResponse({ id: service._id })))
        .catch(err => res.json(failResponse(err.message)))
}
