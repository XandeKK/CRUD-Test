const { mongoose, articleSchema } = require('../../db/schema.js');

const Article = mongoose.model('Article', articleSchema);

module.exports = { Article }