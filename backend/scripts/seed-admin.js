/**
 * Seed script: Creates default admin user
 * Run: node scripts/seed-admin.js
 */
require('dotenv').config();
const { PrismaClient } = require('../src/generated/prisma');

const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedAdmin() {
  console.log('🌱 Seeding admin user...');

  const email = process.env.ADMIN_EMAIL || 'admin@haryali.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const name = 'HarYali Admin';

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`✅ Admin user already exists: ${email}`);
    await prisma.$disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log(`✅ Admin user created:`);
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
  console.log(`   ID: ${admin.id}`);
  console.log('\n⚠️  Change the default password after first login!\n');

  await prisma.$disconnect();
}

seedAdmin().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
