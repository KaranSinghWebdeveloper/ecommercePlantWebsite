/**
 * Quick script to create an admin user in the database.
 * Run with: node scripts/create-admin.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../src/core/prisma');

async function main() {
  const name     = 'Admin';
  const email    = 'admin@haryali.com';
  const password = 'Admin@123';
  const role     = 'super_admin';

  // Hash the password
  const hashed = await bcrypt.hash(password, 12);

  // Upsert so re-running doesn't throw a duplicate error
  const admin = await prisma.adminUser.upsert({
    where:  { email },
    update: { password: hashed, isActive: true },
    create: { name, email, password: hashed, role, isActive: true },
  });

  console.log('\n✅  Admin user ready!');
  console.log('─────────────────────────────');
  console.log(`  Email    : ${email}`);
  console.log(`  Password : ${password}`);
  console.log(`  Role     : ${admin.role}`);
  console.log(`  ID       : ${admin.id}`);
  console.log('─────────────────────────────');
  console.log('Login at: http://localhost:3000/admin/login\n');
}

main()
  .catch((e) => { console.error('Error:', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
