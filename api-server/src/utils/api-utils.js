const STATUS_SUCCESS = 'OK';
const STATUS_FAIL = 'KO';

const responseHelper = (status, data, error) => ({status, data, error})

const successResponse = data => responseHelper(STATUS_SUCCESS, data)

const failResponse = error => responseHelper(STATUS_FAIL, undefined, error)

const handleFindQueryResponse = (res, query) => {
	query
		.then(data => res.json(successResponse(data)))
		.catch(err => res.json(failResponse(err.message)))
}

const handleCreateQueryResponse = (res, query) => {
	query
		.then(data => res.json(successResponse({id: data.id})))
		.catch(err => res.json(failResponse(err.message)))
}

const getEnvValue = envVariableName => {
	if (!process.env[envVariableName]) {
		console.error(`Missing ${envVariableName} in .env file`);
		process.exit(1);
	}

	return process.env[envVariableName];
};

module.exports = { getEnvValue, successResponse, failResponse, handleFindQueryResponse, handleCreateQueryResponse }
