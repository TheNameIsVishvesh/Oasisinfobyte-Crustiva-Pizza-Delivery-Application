import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const LOCAL_MONGO_URI = 'mongodb://localhost:27017/pizza_db';
const BACKUP_DIR = path.join(process.cwd(), '..', 'pizza_db_backup');

async function runBackup() {
  try {
    console.log('Connecting to local MongoDB...');
    await mongoose.connect(LOCAL_MONGO_URI);
    console.log('Connected to local MongoDB.');

    const db = mongoose.connection.db;
    const collections = ['users', 'pizzas', 'inventories', 'orders'];

    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
      console.log(`Created backup directory at: ${BACKUP_DIR}`);
    }

    const { EJSON } = mongoose.mongo.BSON;

    for (const colName of collections) {
      console.log(`Backing up collection: ${colName}...`);
      const docs = await db.collection(colName).find({}).toArray();
      const filePath = path.join(BACKUP_DIR, `${colName}.json`);
      const serialized = EJSON.stringify(docs, null, 2);
      fs.writeFileSync(filePath, serialized, 'utf8');
      console.log(`Saved ${docs.length} documents to ${filePath}`);
    }

    console.log('✅ Local backup completed successfully.');
  } catch (err) {
    console.error('❌ Backup failed:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

runBackup();
