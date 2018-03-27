const { successResponse, failResponse } = require('../../utils/api-utils')
const logic = require('../../logic')
const jwt = require('jsonwebtoken')

const { JWT_SECRET: secret, JWT_EXP: expiration } = process.env
const expiresIn = parseInt(expiration)

module.exports = (req, res) => {
    const { username, password } = req.body
    logic.login(username, password)
        .then(id => {
            const token = jwt.sign({ id }, secret, { expiresIn })
            res.json(successResponse({ token }))
        })
        .catch(err => res.json(failResponse(err.message)))
}
