import cors from 'cors';
import express from 'express';
import { router } from './routes';

export default port => {
	const app = express();

	app.use(cors());
	app.use('/api', router);
	app.listen(port, () => console.log(`Server api running on port ${port}`));
};
