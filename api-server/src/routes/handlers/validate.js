import { successResponse } from '../../utils/api-utils';

export const handleValidate = (req, res) => {
	res.json(successResponse());
};
