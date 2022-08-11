const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');
const validateToken = require('../middlewares/auth');
const path = require('path');

const ENDPOINT_USERS = '/users';
const ENDPOINT_USER = '/user';

router.use(validateToken);

router.get(`${ENDPOINT_USERS}`, async (_req, res, next) => {
	try {
		const users = await UserModel.find({});

		if (!!!users.length) {
			throw new Error('no users found');
		}
		res.send(users);
	} catch (error) {
		next(error);
	}
});

router.get(`${ENDPOINT_USERS}/:id`, async (req, res, next) => {
	try {
		const userId = req.params.id;
		const user = await UserModel.findOne({ _id: userId });

		if (!user) {
			throw new Error('no user with such id found');
		}
		res.send(user);
	} catch (error) {
		next(error);
	}
});

router.get(`${ENDPOINT_USER}/avatarPage`, async (req, res) => {
	const user = await UserModel.findOne({ _id: req.user.userId });

	res.setHeader('content-type', 'text/html;charset=utf-8');
	res.write('<form action="/user/avatarPage/upload" method="POST" enctype="multipart/form-data" >');
	res.write('<input type="file" name="photo">');
	res.write('<input type="submit">');
	res.write('</form>');

	if (user.avatarName) {
		res.write(`<h3>Your current avatar is ${user.avatarName}</h3>`);
	} else {
		res.write(`<h3>This user has no avatar yet</h3>`);
	}

	res.end();
});

router.post(`${ENDPOINT_USER}/avatarPage/upload`, async (req, res) => {
	if (!req.files || (req.files && !req.files.avatar)) return res.status(400).send('no file selected');

	const avatarToUpload = req.files.avatar;
	const extensionName = path.extname(avatarToUpload.name);
	const allowedExtensions = ['.jpeg', '.png'];

	if (!allowedExtensions.includes(extensionName)) return res.status(400).send('invalid image extension');

	const userId = req.user.userId;
	const userToUpdate = await UserModel.findOne({ _id: userId });

	const today = new Date();
	avatarToUpload.mv(`public/${today.getFullYear()}/${today.getMonth()}/${today.getDate()}/` + avatarToUpload.name);
	await UserModel.updateOne(userToUpdate, { $set: { avatarName: avatarToUpload.name } });
	res.send('successfully uploaded avatar!');
});

router.put(`${ENDPOINT_USERS}/:id`, async (req, res, next) => {
	try {
		const userId = req.params.id;
		const updatedUser = req.body;
		const user = await UserModel.findOneAndUpdate({ _id: userId }, updatedUser);

		if (!user) {
			throw new Error('no user with such id found');
		}
		res.send(`success! updated ${user}`);
	} catch (error) {
		next(error);
	}
});

router.delete(`${ENDPOINT_USERS}/:id`, async (req, res, next) => {
	try {
		const userId = req.params.id;
		const user = await UserModel.findOneAndDelete({ _id: userId });

		if (!user) {
			throw new Error('no user with such id found');
		}
		res.send(`success! deleted ${user}`);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
