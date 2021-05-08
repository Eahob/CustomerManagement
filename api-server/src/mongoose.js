const mongoose = require('mongoose');

const init = mongoUri => {
	mongoose.set('useNewUrlParser', true);
	mongoose.set('useFindAndModify', false);
	mongoose.set('useCreateIndex', true);
	mongoose.set('useUnifiedTopology', true);
	mongoose.connect(mongoUri);

	return mongoose.connection;
};

module.exports = { init }
