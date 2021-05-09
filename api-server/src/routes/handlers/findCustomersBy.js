const { handleFindQueryResponse } = require('../../utils/api-utils')
const { findCustomersBy } = require('../../logic')

module.exports = (req, res) => {
	const { name, surname, phone, email, observations } = req.query
	handleFindQueryResponse(res, findCustomersBy(name, surname, phone, email, observations));
};
