require('dotenv').config();

const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');
const validateToken = require('../middlewares/auth');
const path = require('path');
const fs = require('fs');
const { v3: uuidv3 } = require('uuid');
const AWS = require('aws-sdk');

const BUCKET_NAME = process.env.BUCKET_NAME;

const ENDPOINT_USERS = '/users';
const ENDPOINT_USER = '/user';

AWS.config.update({ region: 'eu-central-1' });

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

router.get('/aws', async (_req, res, next) => {
	try {
		const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
		const params = {
			Bucket: 'nodejs-test-app-bucket/images',
			Key: 'beach.jpeg',
		};
		s3.getObject(params, function (err, data) {
			if (err) {
				console.log(err, err.stack);
				res.end();
			} else res.send(`<img src="data:${data.ContentType};base64,${data.Body.toString('base64')}" style="height:100px;"/>`);
		});
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
		res.write(`<h3>Your current avatar: </h3>`);
		res.write(
			`<img src="https://nodejs-test-app-bucket.s3.eu-central-1.amazonaws.com/images/beach.jpeg" style="height:100px;"/>`
		);
	} else {
		res.write(`<h3>This user has no avatar yet</h3>`);
	}

	res.end();
});

router.post(`${ENDPOINT_USER}/avatarPage/upload`, async (req, res, next) => {
	if (!req.files || (req.files && !req.files.avatar)) return res.status(400).send('no file selected');
	// extension
	const avatarFile = req.files.avatar;
	const extensionName = path.extname(avatarFile.name);
	const allowedExtensions = ['.jpeg', '.png'];
	if (!allowedExtensions.includes(extensionName)) return res.status(400).send('invalid image extension');

	//user and dates
	const userToUpdate = await UserModel.findOne({ _id: req.user.userId });

	const today = new Date();
	const todaysDateString = `/${today.getFullYear()}/${today.getMonth()}/${today.getDate()}`;
	const newAvatarName = uuidv4();

	try {
		const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
		const params = {
			Bucket: BUCKET_NAME + todaysDateString,
			Key: newAvatarName,
			Body: avatarFile,
		};

		await s3.putObject(params).promise();
		await UserModel.updateOne(userToUpdate, {
			$set: { avatarName: newAvatarName, avatarDateOfUpload: todaysDateString },
		});

		if (userToUpdate.avatarName) {
			const params = {
				Bucket: BUCKET_NAME + userToUpdate.avatarDateOfUpload,
				Key: userToUpdate.avatarName,
			};
			await s3.deleteObject(params).promise();
		}

		res.send('successfully uploaded avatar!');
	} catch (error) {
		next(error);
	}
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
