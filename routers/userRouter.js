const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');
const validateToken = require('../middlewares/auth');

const ENDPOINT_USERS = '/users';

router.use(validateToken);

router.get(`${ENDPOINT_USERS}`, async (_req, res) => {
	await UserModel.find({})
		.then(users => {
			users.length ? res.send(users) : res.send('no users found');
		})
		.catch(err => {
			res.send('an error has occurred');
		});
});

router.get(`${ENDPOINT_USERS}/:id`, async (req, res) => {
	const userId = req.params.id;

	await UserModel.findOne({ _id: userId })
		.then(user => {
			user ? res.send(user) : res.send('no user with such id found');
		})
		.catch(err => {
			res.send('no user with such id found or another error has occurred');
		});
});

router.put(`${ENDPOINT_USERS}/:id`, async (req, res) => {
	const userId = req.params.id;
	const updatedUser = req.body;

	await UserModel.findOneAndUpdate({ _id: userId }, updatedUser)
		.then(user => {
			user ? res.send(`success! updated ${user}`) : res.send('no user with such id found');
		})
		.catch(err => {
			res.send('no user with such id found or another error has occurred');
		});
});

router.delete(`${ENDPOINT_USERS}/:id`, async (req, res) => {
	const userId = req.params.id;

	await UserModel.findOneAndDelete({ _id: userId })
		.then(user => {
			user ? res.send(`success! deleted ${user}`) : res.send('no user with such id found');
		})
		.catch(err => {
			res.send('no user with such id found or another error has occurred');
		});
});

module.exports = router;
