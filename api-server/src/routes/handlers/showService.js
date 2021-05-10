import { handleFindQueryResponse } from '../../utils/api-utils';
import { showService } from '../../logic';

export default (req, res) => {
	handleFindQueryResponse(res, showService(req.params.id));
}
