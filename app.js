require('./config/database').connect();

const express = require('express');
const userRouter = require('./routers/userRouter');

const app = express();
app.use(express.json());
app.use(userRouter);

module.exports = app;
