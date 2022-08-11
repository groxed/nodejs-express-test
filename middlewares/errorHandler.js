const errorHandler = (err, req, res, next) => {
	console.log(err);
	return res.status(500).send(`an error has occurred. error details: ${err}`);
};

module.exports = errorHandler;
