function successResponse(data) {
    const res = { status: 'OK' }

    if (data) res.data = data

    return res
}

function failResponse(error) {
    const res = { status: 'KO' }

    if (error) res.error = error

    return res
}

module.exports = { successResponse, failResponse }
