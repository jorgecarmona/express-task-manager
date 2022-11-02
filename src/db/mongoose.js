import mongoose from 'mongoose';

try {
  await mongoose.connect(process.env.MONGO_URL, {
    dbName: 'task-manager-api'
  });
  
  console.log(`🗄️ Connected to database...`);
} catch (e) {
  console.log('Error connecting: ', e);
}
