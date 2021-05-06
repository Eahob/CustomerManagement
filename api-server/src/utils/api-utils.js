const STATUS_SUCCESS = 'OK';
const STATUS_FAIL = 'KO';

const response = (status, data, error) => ({status, data, error})

const successResponse = data => response(STATUS_SUCCESS, data)

const failResponse = error => response(STATUS_FAIL, undefined, error)

const exitIfFalse = (message, check) => {
	if (!check) {
		console.error(message);
		process.exit(1);
	}
}

module.exports = { successResponse, failResponse, exitIfFalse }
