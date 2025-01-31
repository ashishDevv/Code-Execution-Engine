import envConfig from './envConfig.js';
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(envConfig.MONGODB_URI);

async function connectToDb() {
    try {
        await client.connect();

        console.log(`Connected to MongoDB Successfully`);

    } catch (err) {
        console.error('Error in DB connection: ', err);
        throw err
    }
}



function getCollection() {
    const db = client.db(envConfig.DATABASE_NAME)
    const collection = db.collection('codes')    // hard coding , will improve later

    return collection
}

async function getCodeSubmissionById(id) {
    try {
        const collection = getCollection()
        const objectId = new ObjectId(id);

        const res = await collection.findOne({ _id: objectId });
        if (!res) {
            console.log(`No document found with id: ${id}`);
        }

        return res

    } catch (err) {
        console.error('Error in getCodeSubmissionById:', err);
        throw err
    }
}

async function updateCodeSubmission(id, data) {
    try {
        const collection = getCollection()
        const objectId = new ObjectId(id);

        const res = await collection.updateOne({ _id: objectId }, { $set: { status: "completed", stdOutput: data.stdout, stdError: data.stderr } });
        if (res.acknowledged !== true) {
            throw new Error("Error in updating code submission")
        }

        return res

    } catch (err) {
        console.error('Error in Updataing Code submission in DB: ', err);
        throw err
    }
}



export default {
    connectToDb,
    getCodeSubmissionById,
    updateCodeSubmission
}
