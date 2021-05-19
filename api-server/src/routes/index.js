import express from 'express';
import jwtValidator from '../utils/jwtValidator';
import {
	createUser,
	login,
	validate,
	findCustomersBy,
	findTicketsBy,
	findServicesBy,
	findProductsBy,
	createCustomer,
	createTicket,
	createService,
	createProduct,
	deleteCustomer,
	deleteTicket,
	deleteService,
	deleteProduct,
	showCustomer,
	showTicket,
	showService,
	showProduct,
	editCustomer,
	editTicket,
	editService,
	editProduct
} from './handlers';

const router = express();
const jsonBodyParser = express.json();

//---

router.get('/validate', jwtValidator, validate);

//---

router.get('/customers', jwtValidator, findCustomersBy);

router.get('/tickets', jwtValidator, findTicketsBy);

router.get('/services', jwtValidator, findServicesBy);

router.get('/products', jwtValidator, findProductsBy);

//---

router.get('/customer/:id', jwtValidator, showCustomer);

router.get('/ticket/:id', jwtValidator, showTicket);

router.get('/service/:id', jwtValidator, showService);

router.get('/product/:id', jwtValidator, showProduct);

//---

router.delete('/customer/:id', jwtValidator, deleteCustomer);

router.delete('/ticket/:id', jwtValidator, deleteTicket);

router.delete('/service/:id', jwtValidator, deleteService);

router.delete('/product/:id', jwtValidator, deleteProduct);

//---

router.post('/user', [jwtValidator, jsonBodyParser], createUser);

router.post('/login', jsonBodyParser, login);

//---

router.post('/customer', [jwtValidator, jsonBodyParser], createCustomer);

router.post('/ticket', [jwtValidator, jsonBodyParser], createTicket);

router.post('/service', [jwtValidator, jsonBodyParser], createService);

router.post('/product', [jwtValidator, jsonBodyParser], createProduct);

//---

router.put('/customer/:id', [jwtValidator, jsonBodyParser], editCustomer);

router.put('/ticket/:id', [jwtValidator, jsonBodyParser], editTicket);

router.put('/service/:id', [jwtValidator, jsonBodyParser], editService);

router.put('/product/:id', [jwtValidator, jsonBodyParser], editProduct);

export { router };
