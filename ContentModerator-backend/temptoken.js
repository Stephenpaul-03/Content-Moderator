const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = require('./firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uid = 'EZZQ68QlUAeFq9pwm7yq';

admin.auth()
  .createCustomToken(uid)
  .then((customToken) => {
    console.log('Custom token:', customToken);
    process.exit();
  })
  .catch((error) => {
    console.log('Error creating custom token:', error);
    process.exit(1);
  });
