const http = require('http');
const app = require('./app');
require('dotenv').config();
require('./logger/loggerErrors');
require('./logger/dailyArchiveLogs');

const controller = require('./socketInit');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
server.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`)
);
controller.createConnection(server);
