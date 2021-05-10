const STATUS_SUCCESS = 'OK';
const STATUS_FAIL = 'KO';

const responseHelper = (status, data, error) => ({status, data, error})

export const successResponse = data => responseHelper(STATUS_SUCCESS, data)

export const failResponse = error => responseHelper(STATUS_FAIL, undefined, error)

export const handleFindQueryResponse = (res, query) => {
	query
		.then(data => res.json(successResponse(data)))
		.catch(err => res.json(failResponse(err.message)))
}

export const handleCreateQueryResponse = (res, query) => {
	query
		.then(data => res.json(successResponse({id: data.id})))
		.catch(err => res.json(failResponse(err.message)))
}

export const handleUpdateOneQueryResponse = (res, query) => {
	query
		.then(data => res.json(successResponse({id: data.id})))
		.catch(err => res.json(failResponse(err.message)))
}

export const handleDeleteQueryResponse = (res, query) => {
	query
		.then(() => res.json(successResponse()))
		.catch(err => res.json(failResponse(err.message)))
}

export const getEnvValue = envVariableName => {
	if (!process.env[envVariableName]) {
		console.error(`Missing ${envVariableName} in .env file`);
		process.exit(1);
	}

	return process.env[envVariableName];
};
