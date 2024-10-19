import { articleSchema, IArticle } from '../../db/schema';
import mongoose, { Model } from 'mongoose';

const Article : Model<IArticle> = mongoose.model<IArticle>('Article', articleSchema);

export { Article, IArticle }