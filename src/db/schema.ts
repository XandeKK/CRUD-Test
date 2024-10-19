import { mongoose } from '../config/database';
const { Schema } = mongoose;

interface IArticle {
	_id: mongoose.Types.ObjectId,
	title: string,
	body: string,
	date: Date
}

const articleSchema = new Schema<IArticle>({
	title: {type: String, required: true},
	body: {type: String, required: true},
	date: { type: Date, default: Date.now }
});

export { articleSchema, IArticle }