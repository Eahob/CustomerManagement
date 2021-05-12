import { EXIT_CODE_MISSING_VARIABLE_DOTENV } from './exit_codes';

const STATUS_SUCCESS = 'OK';
const STATUS_FAIL = 'KO';

const responseHelper = (status, data, error) => ({ status, data, error });

export const successResponse = data => responseHelper(STATUS_SUCCESS, data);

export const failResponse = error => responseHelper(STATUS_FAIL, undefined, error);

export const handleFindQueryResponse = queryLogicCallback => (request, response) => {
	queryLogicCallback(request.body.data)
		.then(data => response.json(successResponse(data)))
		.catch(err => response.json(failResponse(err.message)));
};

export const handleSaveQueryResponse = queryLogicCallback => (request, response) => {
	queryLogicCallback(request.body.data)
		.then(data => response.json(successResponse({ id: data.id })))
		.catch(err => response.json(failResponse(err.message)));
};

export const handleEditQueryResponse = queryLogicCallback => (request, response) => {
	queryLogicCallback(request.body.data, request.params.id)
		.then(data => response.json(successResponse({ id: data.id })))
		.catch(err => response.json(failResponse(err.message)));
};

export const handleHideQueryResponse = queryLogicCallback => (request, response) => {
	queryLogicCallback(request.params.id)
		.then(() => response.json(successResponse()))
		.catch(err => response.json(failResponse(err.message)));
};

export const handleShowResponse = queryLogicCallback => (request, response) => {
	queryLogicCallback(request.params.id)
		.then(data => response.json(successResponse(data)))
		.catch(err => response.json(failResponse(err.message)));
};

export const getEnvValue = envVariableName => {
	if (!process.env[envVariableName]) {
		console.error(`Missing ${envVariableName} in .env file`);
		process.exit(EXIT_CODE_MISSING_VARIABLE_DOTENV);
	}

	return process.env[envVariableName];
};
