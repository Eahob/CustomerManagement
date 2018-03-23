import api from 'api-client'

api.protocol = process.env.REACT_APP_API_PROTOCOL
api.host = process.env.REACT_APP_API_HOST
api.port = process.env.REACT_APP_API_PORT

export default api
