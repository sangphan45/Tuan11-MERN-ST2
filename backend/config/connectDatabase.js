const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: 'backend/config/config.env' });

const DATABASE_URL = process.env.DATABASE_URL;

exports.connectDatabase = () => {
  mongoose
    .connect(DATABASE_URL, {
      useNewUrlParser: true,
    })
    .then(() => console.log(`database connected successfully ${DATABASE_URL}`))
    .catch((err) => {
      console.log(`error connecting database: ${err.message}`);
      process.exit(1);
    });
};
