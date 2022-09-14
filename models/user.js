const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	firstName: { type: String, minLength: 1, maxLength: 30, default: 'Name' },
	lastName: { type: String, minLength: 1, maxLength: 30, default: 'Surname' },
	email: { type: String, required: true, minLength: 5, unique: true },
	password: { type: String, required: true, minLength: 6 },
	token: { type: String },
	avatar: { name: { type: String }, dateOfUpload: { type: String } },
});

module.exports = mongoose.model('UserSchema', UserSchema);

//class User {
// firstName: string;
// lastName: string;
// email: string;
// password: string;
// }
