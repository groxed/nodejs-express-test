require('dotenv').config();

const mongoose = require('mongoose');

const MONGODB_URL = process.env.MONGODB_URL;

exports.connect = () => {
	mongoose
		.connect(MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			console.log('connected');
		})
		.catch(error => {
			console.log('an error has occurred in db:');
			console.error(error);
		});
};
