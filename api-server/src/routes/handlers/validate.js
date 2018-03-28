const { successResponse, failResponse } = require('../../utils/api-utils')

module.exports = (req, res) => {
    res.json(successResponse())
}
