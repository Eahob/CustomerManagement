import { successResponse, failResponse } from '../../utils/api-utils';
import { login } from '../../logic';
import jwt from 'jsonwebtoken';

const { JWT_SECRET: secret, JWT_EXP: expiration } = process.env;
const expiresIn = parseInt(expiration, 10);

export default (req, res) => {
	const { username, password } = req.body;

	login(username, password)
		.then(id => {
			const token = jwt.sign({ id }, secret, { expiresIn });

			res.json(successResponse({ token }));
		})
		.catch(err => res.json(failResponse(err.message)));
};
