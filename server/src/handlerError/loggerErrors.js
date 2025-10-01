const fs = require('fs');
const path = require('path');

const LOG_DIR = path.resolve(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'errors.log');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function toErrorRecord(err, code) {
  return {
    message: err.message || String(err),
    time: Date.now(),
    code: code || err.code || null,
    stackTrace: {
      name: err.name,
      stack: err.stack
    }
  };
}

function logError(err, code) {
  const record = toErrorRecord(err, code);
  const line = JSON.stringify(record) + '\n';
  fs.appendFileSync(LOG_FILE, line, 'utf8');
}

module.exports = { logError };