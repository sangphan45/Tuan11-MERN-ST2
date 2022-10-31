const app = require('./app');

const dotenv = require('dotenv');

// Handle Uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log('Shutting down server due to uncaught exception');
  process.exit(1);
});

dotenv.config({ path: 'backend/config/config.env' });

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT} in ${PORT}`);
});
