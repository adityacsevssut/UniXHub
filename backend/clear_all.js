// Clear Database and Firebase Users Script
const admin = require('firebase-admin');
const mongoose = require('mongoose');
require('dotenv').config();

// Initialize Firebase Admin (if you have service account)
// Uncomment if you have Firebase Admin SDK set up
/*
const serviceAccount = require('./path-to-your-serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
*/

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB.');
    return mongoose.connection.db.collection('users').countDocuments();
  })
  .then(count => {
    console.log(`Users before cleanup: ${count}`);
    return mongoose.connection.db.collection('users').deleteMany({});
  })
  .then(() => {
    console.log('Executed deleteMany({}) on users collection.');
    return mongoose.connection.db.collection('users').countDocuments();
  })
  .then(count => {
    console.log(`Users remaining: ${count}`);
    
    // If Firebase Admin is set up, you can delete Firebase users here
    /*
    return admin.auth().listUsers()
      .then(listUsersResult => {
        const deletePromises = listUsersResult.users.map(user => 
          admin.auth().deleteUser(user.uid)
        );
        return Promise.all(deletePromises);
      });
    */
  })
  .then(() => {
    console.log('Cleanup complete!');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error during cleanup:', err);
    mongoose.connection.close();
  });
