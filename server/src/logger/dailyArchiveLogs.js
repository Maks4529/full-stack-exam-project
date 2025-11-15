const fs = require('fs').promises;
const path = require('path');
const cron = require('node-cron');

const LOG_DIR = path.resolve(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'errors.log');

cron.schedule('59 23 * * *', async () => {
  console.log('Running log archiving task...');
  try {
    try {
      await fs.access(LOG_FILE);
    } catch (e) {
      console.log('Log file not found, nothing to archive.');
      return;
    }

    const raw = await fs.readFile(LOG_FILE, 'utf8');
    if (!raw || raw.trim().length === 0) {
      console.log('Log file is empty, nothing to archive.');
      return;
    }

    const lines = raw
      .trim()
      .split('\n')
      .filter(Boolean)
      .map(line => JSON.parse(line));

    if (lines.length === 0) return;

    const transformed = lines.map(item => ({
      message: item.message,
      code: item.code,
      time: item.time
    }));

    const timestamp = new Date().toISOString()
                                .replace(/:/g, '-')
                                .split('.')[0];     
    
    const archiveName = `errors-${timestamp}.json`;
    const archivePath = path.join(LOG_DIR, archiveName);

    await fs.writeFile(archivePath, JSON.stringify(transformed, null, 2), 'utf8');
    await fs.truncate(LOG_FILE, 0);

    console.log(`Successfully created new archive: ${archiveName}`);
  } catch (err) {
    console.error('Error during log archiving:', err);
  }
});