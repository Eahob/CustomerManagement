import { EXIT_CODE_MISSING_VARIABLE_DOTENV } from './exit_codes';

const STATUS_SUCCESS = 'OK';
const STATUS_FAIL = 'KO';

const responseHelper = (status, data, error) => ({ status, data, error });

export const successResponse = data => responseHelper(STATUS_SUCCESS, data);

export const failResponse = error => responseHelper(STATUS_FAIL, undefined, error);

const handler = (requestFilter, dataFilter) => queryLogicCallback => async(request, response) => {
	try {
		const data = await queryLogicCallback(...requestFilter(request));

		return response.json(successResponse(dataFilter(data)));
	} catch (error) {
		console.error(error);

		return response.json(failResponse(error.message));
	}
};

const idObject = data => ({ id: data.id });
const identity = data => data;
const doNothing = () => {};
const getIdFromParams = request => [request.params.id];
// const getDataFromBody = request => [request.body?.data ?? {}];
const getDataFromQuery = request => [request.query];
const getDataFromBodyStrict = request => [request.body.data];
const getDataFromBodyStrictAndIdFromParams = request => getDataFromBodyStrict(request).concat(getIdFromParams(request));

export const handleShowResponse = handler(getIdFromParams, identity);
export const handleHideQueryResponse = handler(getIdFromParams, doNothing);
export const handleFindQueryResponse = handler(getDataFromQuery, identity);
export const handleSaveQueryResponse = handler(getDataFromBodyStrict, idObject);
export const handleEditQueryResponse = handler(getDataFromBodyStrictAndIdFromParams, idObject);

export const getEnvValue = envVariableName => {
	if (!process.env[envVariableName]) {
		console.error(`Missing ${envVariableName} in .env file`);
		process.exit(EXIT_CODE_MISSING_VARIABLE_DOTENV);
	}

	return process.env[envVariableName];
};
