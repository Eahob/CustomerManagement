import { successResponse, failResponse } from '../../utils/api-utils';
import * as logic from '../../logic';
import jwt from 'jsonwebtoken';

const { JWT_SECRET: secret, JWT_EXP: expiration } = process.env
const expiresIn = parseInt(expiration)

export default (req, res) => {
	const { username, password } = req.body
	logic.login(username, password)
		.then(id => {
			const token = jwt.sign({ id }, secret, { expiresIn })
			res.json(successResponse({ token }))
		})
		.catch(err => res.json(failResponse(err.message)))
}
