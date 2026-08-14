const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/campusunstop', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function() {
  console.log('Connected to MongoDB');

  try {
    // Get all collections
    const collections = await db.db.listCollections().toArray();
    console.log('\n=== DATABASE COLLECTIONS ===');
    collections.forEach(col => console.log(`- ${col.name}`));

    // Extract data from each collection
    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`\n=== ${collectionName.toUpperCase()} COLLECTION ===`);

      const data = await db.collection(collectionName).find({}).toArray();
      if (data.length === 0) {
        console.log('No documents found');
      } else {
        console.log(`Found ${data.length} document(s):`);
        data.forEach((doc, index) => {
          console.log(`\n--- Document ${index + 1} ---`);
          console.log(JSON.stringify(doc, null, 2));
        });
      }
    }

    console.log('\n=== EXTRACTION COMPLETE ===');
    process.exit(0);
  } catch (error) {
    console.error('Error extracting data:', error);
    process.exit(1);
  }
});