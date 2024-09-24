import { execSync } from 'child_process'

try {
  console.log('Running Prisma migrations...');
  execSync('npx prisma migrate deploy --schema=db/prisma/schema.prisma', { stdio: 'inherit' });

  console.log('Generating Prisma client...');
  execSync('npx prisma generate --schema=db/prisma/schema.prisma', { stdio: 'inherit' });

  console.log('Prisma setup db completed.');
} catch (error) {
  console.error('Error running Prisma setup db:', error);
  process.exit(1);
}