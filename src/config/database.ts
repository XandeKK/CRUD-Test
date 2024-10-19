import mongoose from 'mongoose';

async function main() : Promise<void> {
	try {
		await mongoose.connect('mongodb://127.0.0.1:27017/test');
	} catch (err) {
		console.log(err)
	}
}

main()

export { mongoose }