const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	firstName: { type: String, required: true, minLength: 1, maxLength: 30 },
	lastName: { type: String, required: true, minLength: 1, maxLength: 30 },
	email: { type: String, required: true, minLength: 5 },
	password: { type: String, required: true, minLength: 6, maxLength: 20 },
});

module.exports = mongoose.model('UserSchema', UserSchema);

//class User {
// firstName: string;
// lastName: string;
// email: string;
// password: string;
// }
