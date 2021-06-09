import express from 'express';
import jwtValidator from '../utils/jwtValidator';
import {
	handleCreateUser,
	handleLogin,
	handleValidate,
	handleFindCustomersBy,
	handleFindTicketsBy,
	handleFindServicesBy,
	handleFindProductsBy,
	handleCreateCustomer,
	handleCreateTicket,
	handleCreateService,
	handleCreateProduct,
	handleDeleteCustomer,
	handleDeleteTicket,
	handleDeleteService,
	handleDeleteProduct,
	handleShowCustomer,
	handleShowTicket,
	handleShowService,
	handleShowProduct,
	handleEditCustomer,
	handleEditTicket,
	handleEditService,
	handleEditProduct
} from './handlers';

const router = express();
const jsonBodyParser = express.json();

//---

router.get('/validate', jwtValidator, handleValidate);

//---

router.get('/customers', jwtValidator, handleFindCustomersBy);

router.get('/tickets', jwtValidator, handleFindTicketsBy);

router.get('/services', jwtValidator, handleFindServicesBy);

router.get('/products', jwtValidator, handleFindProductsBy);

//---

router.get('/customer/:id', jwtValidator, handleShowCustomer);

router.get('/ticket/:id', jwtValidator, handleShowTicket);

router.get('/service/:id', jwtValidator, handleShowService);

router.get('/product/:id', jwtValidator, handleShowProduct);

//---

router.delete('/customer/:id', jwtValidator, handleDeleteCustomer);

router.delete('/ticket/:id', jwtValidator, handleDeleteTicket);

router.delete('/service/:id', jwtValidator, handleDeleteService);

router.delete('/product/:id', jwtValidator, handleDeleteProduct);

//---

router.post('/user', [jwtValidator, jsonBodyParser], handleCreateUser);

router.post('/login', jsonBodyParser, handleLogin);

//---

router.post('/customer', [jwtValidator, jsonBodyParser], handleCreateCustomer);

router.post('/ticket', [jwtValidator, jsonBodyParser], handleCreateTicket);

router.post('/service', [jwtValidator, jsonBodyParser], handleCreateService);

router.post('/product', [jwtValidator, jsonBodyParser], handleCreateProduct);

//---

router.put('/customer/:id', [jwtValidator, jsonBodyParser], handleEditCustomer);

router.put('/ticket/:id', [jwtValidator, jsonBodyParser], handleEditTicket);

router.put('/service/:id', [jwtValidator, jsonBodyParser], handleEditService);

router.put('/product/:id', [jwtValidator, jsonBodyParser], handleEditProduct);

export { router };
