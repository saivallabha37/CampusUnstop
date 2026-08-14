const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/event_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function() {
  console.log('Connected to MongoDB');

  try {
    // List all databases
    const adminDb = db.db.admin();
    const databases = await adminDb.listDatabases();
    console.log('\n=== ALL DATABASES ===');
    databases.databases.forEach(db => console.log(`- ${db.name} (${db.sizeOnDisk} bytes)`));

    // Get all collections in campusunstop database
    const collections = await db.db.listCollections().toArray();
    console.log('\n=== COLLECTIONS IN CAMPUSUNSTOP DATABASE ===');
    if (collections.length === 0) {
      console.log('No collections found. Database might be empty.');
    } else {
      collections.forEach(col => console.log(`- ${col.name}`));
    }

    // Try to get collections even if not listed
    const possibleCollections = ['users', 'events', 'bookings', 'registrations'];
    console.log('\n=== CHECKING POSSIBLE COLLECTIONS ===');

    for (const collectionName of possibleCollections) {
      try {
        const count = await db.collection(collectionName).countDocuments();
        console.log(`- ${collectionName}: ${count} documents`);

        if (count > 0) {
          const data = await db.collection(collectionName).find({}).toArray();
          console.log(`\n--- ${collectionName.toUpperCase()} DATA ---`);
          data.forEach((doc, index) => {
            console.log(`\nDocument ${index + 1}:`);
            console.log(JSON.stringify(doc, null, 2));
          });
        }
      } catch (error) {
        console.log(`- ${collectionName}: Collection doesn't exist or error: ${error.message}`);
      }
    }

    console.log('\n=== EXTRACTION COMPLETE ===');
    process.exit(0);
  } catch (error) {
    console.error('Error extracting data:', error);
    process.exit(1);
  }
});