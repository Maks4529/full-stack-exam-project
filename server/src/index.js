require('dotenv').config();
const http = require('http');
const app = require('./app');
const db = require('./models');
require('./logger/loggerErrors');
require('./logger/dailyArchiveLogs');

const controller = require('./socketInit');

const checkModels = (required = []) => {
  const missing = [];
  for (const name of required) {
    const singular = name.endsWith('s') ? name.slice(0, -1) : name;
    const plural = singular + 's';
    if (!db[singular] && !db[plural]) {
      missing.push(name);
    }
  }

  if (missing.length) {
    throw new Error(`Required models are missing: ${missing.join(', ')}`);
  }
  console.log('The database model verification was successful.');
};

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

try {
  checkModels([
    'User',
    'Message',
    'Conversation',
    'UserConversation',
    'Catalog',
    'CatalogConversation',
  ]);
  server.listen(PORT, () =>
    console.log(`Example app listening on port ${PORT}!`)
  );
  controller.createConnection(server);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
