import  { successResponse, failResponse } from '../../utils/api-utils';
import * as logic from '../../logic';

export default (req, res) => {
    const {pricemin, pricemax, name} = req.query
    logic.findServicesBy(pricemin, pricemax, name)
        .then(services => res.json(successResponse(services)))
        .catch(err => res.json(failResponse(err.message)))
}