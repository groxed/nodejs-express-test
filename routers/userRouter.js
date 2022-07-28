const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateToken = require('../middlewares/auth');

const ENDPOINT_USERS = '/users';

/*Ендпойнт щоб  можна було додати юзера = sign-up
Ендпойнт що побачити всіх юзерів 
Ендпойнт що побачити одного юзера
Ендпойнт що редагувати одного юзера
Ендпойтн щоб видалити Юзера */

router.post(`/sign-up`, async (req, res) => {
	try {
		const { firstName, lastName, email, password } = req.body;

		if (!(firstName && lastName && email && password)) res.status(400).send('please fill out all info');

		const alreadyRegisteredEmail = await UserModel.findOne({ email });
		if (alreadyRegisteredEmail) res.status(409).send(`user with email ${email} is already registered`);

		const hashedPassword = await bcrypt.hash(password, 5);

		const userToRegister = await UserModel.create({
			firstName,
			lastName,
			email: email.toLowerCase(),
			password: hashedPassword,
		});

		const token = jwt.sign({ userId: userToRegister._id }, process.env.TOKEN_KEY, { expiresIn: '1h' });

		userToRegister.token = token;

		res.status(201).send(
			`successfully registered ${userToRegister.firstName} ${userToRegister.lastName}! your token is ${userToRegister.token}`
		);
	} catch (e) {
		console.log(e);
		res.status(500).send('an error has occurred');
	}
});

router.post(`/sign-in`, async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!(email && password)) res.status(400).send('email or password cannot be empty');

		const existingUser = await UserModel.findOne({ email });
		if (existingUser && (await bcrypt.compare(password, existingUser.password))) {
			const token = jwt.sign({ userId: existingUser._id }, process.env.TOKEN_KEY, { expiresIn: '1h' });

			existingUser.token = token;

			return res
				.status(201)
				.send(
					`welcome ${existingUser.firstName} ${existingUser.lastName}! your token is ${existingUser.token}`
				);
		}
		res.status(400).send('invalid password or email');
	} catch (e) {
		console.log(e);
		res.status(500).send('an error has occurred');
	}
});

router.get(`${ENDPOINT_USERS}`, validateToken, async (_req, res) => {
	await UserModel.find({})
		.then(users => {
			users.length ? res.send(users) : res.send('no users found');
		})
		.catch(err => {
			res.send('an error has occurred');
		});
});

router.get(`${ENDPOINT_USERS}/:id`, validateToken, async (req, res) => {
	const userId = req.params.id;

	await UserModel.findOne({ _id: userId })
		.then(user => {
			user ? res.send(user) : res.send('no user with such id found');
		})
		.catch(err => {
			res.send('no user with such id found or another error has occurred');
		});
});

router.put(`${ENDPOINT_USERS}/:id`, validateToken, async (req, res) => {
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

router.delete(`${ENDPOINT_USERS}/:id`, validateToken, async (req, res) => {
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
