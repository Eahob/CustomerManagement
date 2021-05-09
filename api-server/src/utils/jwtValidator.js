import jwt from 'jsonwebtoken';
import { failResponse } from './api-utils';

const JWT_SECRET = process.env.JWT_SECRET;
const DISSABLE_VALIDATOR = Number(process.env.DISSABLE_VALIDATOR);

const doNothing = (req, res, next) => {
	next();
};

const validator = (req, res, next) => {
	const auth = req.get('authorization');

	try {
		const token = auth.split(' ')[1];

		jwt.verify(token, JWT_SECRET)
		next()
	} catch (err) {
		res.json(failResponse('invalid token'))
	}
};

const jwtValidator = () => {
	if (DISSABLE_VALIDATOR) {
		return doNothing;
	}

	return validator;
}

export default jwtValidator();

