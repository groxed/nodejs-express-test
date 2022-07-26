const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');

const ENDPOINT_USERS = '/users';

/*Ендпойнт щоб  можна було додати юзера 
Ендпойнт що побачити всіх юзерів 
Ендпойнт що побачити одного юзера
Ендпойнт що редагувати одного юзера
Ендпойтн щоб видалити Юзера */

router.post(`${ENDPOINT_USERS}`, (req, res) => {
	const userRequest = req.body;

	UserModel.create(userRequest, (err, savedUser) => {
		if (err) {
			res.send('an error has occurred');
			return err;
		}
		res.send(`success! added ${savedUser}`);
	});
});

router.get(`${ENDPOINT_USERS}`, (_req, res) => {
	UserModel.find({}, (err, users) => {
		if (err) {
			res.send('an error has occurred');
			return err;
		}
		users.length ? res.send(users) : res.send('no users found');
	});
});

router.get(`${ENDPOINT_USERS}/:id`, (req, res) => {
	const userId = req.params.id;

	UserModel.findOne({ _id: userId }, (err, user) => {
		if (err) {
			res.send('no user with such id found or another error has occurred');
			return err;
		}
		user ? res.send(user) : res.send('no user with such id found');
	});
});

router.put(`${ENDPOINT_USERS}/:id`, (req, res) => {
	const userId = req.params.id;
	const updatedUser = req.body;

	UserModel.findOneAndUpdate({ _id: userId }, updatedUser, (err, user) => {
		if (err) {
			res.send('no user with such id found or another error has occurred');
			return err;
		}
		user ? res.send(`success! updated ${user}`) : res.send('no user with such id found');
	});
});

router.delete(`${ENDPOINT_USERS}/:id`, (req, res) => {
	const userId = req.params.id;

	UserModel.findOneAndDelete({ _id: userId }, (err, user) => {
		if (err) {
			res.send('no user with such id found or another error has occurred');
			return err;
		}
		user ? res.send(`success! deleted ${user}`) : res.send('no user with such id found');
	});
});

module.exports = router;
