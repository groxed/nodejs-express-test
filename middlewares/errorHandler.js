const errorHandler = (err, req, res, next) => {
	console.log(e);
	res.status(500).send('an error has occurred');
};

module.exports = errorHandler;
