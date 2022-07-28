const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post(`/sign-up`, async (req, res) => {
	const { firstName, lastName, email, password } = req.body;

	if (!(firstName && lastName && email && password)) return res.status(400).send('please fill out all info');

	const alreadyRegisteredEmail = await UserModel.findOne({ email });
	if (alreadyRegisteredEmail) return res.status(409).send(`user with email ${email} is already registered`);

	const hashedPassword = await bcrypt.hash(password, 5);

	const userToRegister = await UserModel.create({
		firstName,
		lastName,
		email: email.toLowerCase(),
		password: hashedPassword,
	});

	const token = jwt.sign({ userId: userToRegister._id }, process.env.TOKEN_KEY, { expiresIn: '1h' });

	res.status(201).send(
		`successfully registered ${userToRegister.firstName} ${userToRegister.lastName}! your token is ${token}`
	);
});

router.post(`/sign-in`, async (req, res) => {
	const { email, password } = req.body;

	if (!(email && password)) return res.status(400).send('email or password cannot be empty');

	const existingUser = await UserModel.findOne({ email });
	if (existingUser && (await bcrypt.compare(password, existingUser.password))) {
		const token = jwt.sign({ userId: existingUser._id }, process.env.TOKEN_KEY, { expiresIn: '1h' });

		return res
			.status(201)
			.send(`welcome ${existingUser.firstName} ${existingUser.lastName}! your token is ${token}`);
	}
	res.status(400).send('invalid password or email');
});

module.exports = router;
