const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const LOG_DIR = path.resolve(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'errors.log');

cron.schedule('59 23 * * *', () => {
  try {
    if (!fs.existsSync(LOG_FILE)) return;

    const raw = fs.readFileSync(LOG_FILE, 'utf8').trim();
    if (!raw) return;

    const lines = raw
      .split('\n')
      .filter(Boolean)
      .map(line => JSON.parse(line));

    const transformed = lines.map(item => ({
      message: item.message,
      code: item.code,
      time: item.time
    }));

    const date = new Date().toISOString().split('T')[0];
    const archiveName = `errors-${date}.json`;
    const archivePath = path.join(LOG_DIR, archiveName);

    fs.writeFileSync(archivePath, JSON.stringify(transformed, null, 2), 'utf8');

    fs.writeFileSync(LOG_FILE, '', 'utf8');

    console.log(`New archive created: ${archiveName}`);
  } catch (err) {
    console.error('Error while archiving logs:', err);
  }
});