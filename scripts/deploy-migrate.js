const { execSync } = require('child_process');

console.log('[Deploy] Checking database synchronization...');

if (!process.env.DATABASE_URL) {
  console.log('[Deploy] No DATABASE_URL environment variable detected. Skipping prisma db push.');
  process.exit(0);
}

try {
  console.log('[Deploy] Synchronizing schema to remote database (prisma db push)...');
  execSync('npx prisma db push --accept-data-loss --skip-generate', {
    stdio: 'inherit',
    env: process.env,
  });
  console.log('[Deploy] Database schema synchronized successfully.');
} catch (error) {
  console.warn('[Deploy] Warning: Database schema sync encountered an issue. Proceeding with build anyway.');
}
