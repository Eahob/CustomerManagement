const { failResponse } = require('./api-utils')
const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET

const jwtValidator = (req, res, next) => {
	const auth = req.get('authorization')
	try {
		const token = auth.split(' ')[1]
		jwt.verify(token, secret)
		next()
	} catch(err) {
		res.json(failResponse('invalid token'))
	}
}

const doNothing = (req, res, next) => {
	next()
};

module.exports = Number(process.env.DISSABLE_VALIDATOR) ? doNothing : jwtValidator;
