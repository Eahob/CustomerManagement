import { handleFindQueryResponse } from '../../utils/api-utils';
import { showTicket } from '../../logic';

export default (req, res) => {
	handleFindQueryResponse(res, showTicket(req.params.id))
}
