require('./config/database').connect();

const express = require('express');
const errorHandler = require('./middlewares/errorHandler');
const userRouter = require('./routers/userRouter');
const authRouter = require('./routers/authRouter');
const fileUpload = require('express-fileupload');

const app = express();
app.use(express.json());
app.use(
	fileUpload({
		createParentPath: true,
		limits: {
			fileSize: 1024 * 1024,
		},
		abortOnLimit: true,
	})
);
app.use(authRouter);
app.use(userRouter);
app.use(errorHandler);

module.exports = app;
