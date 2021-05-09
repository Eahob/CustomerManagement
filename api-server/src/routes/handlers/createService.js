const { handleCreateQueryResponse } = require('../../utils/api-utils')
const { createService } = require('../../logic')

module.exports = (req, res) => {
	const { name, price, tax } = req.body;
	handleCreateQueryResponse(res, createService(name, price, tax));
}
