const mongoose = require('mongoose');
const express = require('express');
const userRouter = require('./routers/userRouter');

const MONGODB_URL = 'mongodb+srv://admin:myPassword@cluster0.xpddkr4.mongodb.net/?retryWrites=true&w=majority';
const PORT = 3000;

const app = express();
app.use(express.json());
app.use(userRouter);

mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
	console.log('db connect');
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'an error has occurred'));

app.listen(PORT, () => {
	console.log('server listening on port ' + PORT);
});
