const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eduspark';

async function checkDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');
    
    const collections = ['faculties', 'students', 'notices', 'quizzes'];
    for (const colName of collections) {
      const data = await mongoose.connection.db.collection(colName).find({}).toArray();
      console.log(`Collection: ${colName}, Count: ${data.length}`);
      if (data.length > 0) {
        console.log('Last 1 entry:', JSON.stringify(data[data.length - 1], null, 2));
      }
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkDB();
