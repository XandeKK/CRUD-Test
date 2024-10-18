const { mongoose } = require('../config/database');
const { Schema } = mongoose;

const articleSchema = new Schema({
	title: {type: String, required: true},
	body: {type: String, required: true},
	date: { type: Date, default: Date.now }
});

module.exports = { mongoose, articleSchema }