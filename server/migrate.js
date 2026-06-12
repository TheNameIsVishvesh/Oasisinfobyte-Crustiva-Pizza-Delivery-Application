import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const BACKUP_DIR = path.join(process.cwd(), '..', 'pizza_db_backup');
const ATLAS_URI = process.env.MONGO_URI;

if (!ATLAS_URI || ATLAS_URI.includes('localhost') || ATLAS_URI.includes('127.0.0.1')) {
  console.error('❌ Error: MONGO_URI in .env must be set to the Atlas connection string.');
  process.exit(1);
}

async function runMigration() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log(`Connected successfully to database: ${mongoose.connection.db.databaseName}`);

    if (mongoose.connection.db.databaseName !== 'Crustiva') {
      console.warn(`⚠️ WARNING: Connected to database "${mongoose.connection.db.databaseName}" instead of "Crustiva".`);
    }

    const db = mongoose.connection.db;
    const collections = ['users', 'pizzas', 'inventories', 'orders'];
    const { EJSON } = mongoose.mongo.BSON;

    const summary = [];

    for (const colName of collections) {
      const filePath = path.join(BACKUP_DIR, `${colName}.json`);
      if (!fs.existsSync(filePath)) {
        console.error(`❌ Backup file not found: ${filePath}`);
        continue;
      }

      console.log(`Reading backup for collection: ${colName}...`);
      const fileData = fs.readFileSync(filePath, 'utf8');
      const docs = EJSON.parse(fileData);

      console.log(`Found ${docs.length} documents for ${colName}. Migrating to Atlas...`);

      // Clear existing collection in Atlas first to prevent duplicates
      await db.collection(colName).deleteMany({});

      if (docs.length > 0) {
        // Insert docs using the native collection to preserve ObjectIds and custom _id values
        await db.collection(colName).insertMany(docs);
      }

      // Verify counts
      const atlasCount = await db.collection(colName).countDocuments({});
      const status = atlasCount === docs.length ? 'SUCCESS' : 'COUNT_MISMATCH';

      summary.push({
        collection: colName,
        localCount: docs.length,
        atlasCount: atlasCount,
        status: status
      });

      console.log(`Collection ${colName} migration completed. Status: ${status}`);
    }

    console.log('\n=================== MIGRATION SUMMARY ===================');
    console.table(summary);
    console.log('=========================================================\n');

    const hasErrors = summary.some(s => s.status !== 'SUCCESS');
    if (hasErrors) {
      console.error('❌ Migration finished with count mismatches.');
      process.exit(1);
    } else {
      console.log('✅ Migration completed successfully with all counts matching!');
    }

  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

runMigration();
