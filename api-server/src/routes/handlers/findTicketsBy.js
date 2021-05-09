import  { successResponse, failResponse } from '../../utils/api-utils';
import * as logic from '../../logic';

export default (req, res) => {
    const {pricemin, pricemax, datemin, datemax, customerId} = req.query
    logic.findTicketsBy(pricemin, pricemax, datemin, datemax, customerId)
        .then(tickets => res.json(successResponse(tickets)))
        .catch(err => res.json(failResponse(err.message)))
}
