require('dotenv').config();
const app = require('./app');
// const { initRedis } = require('./core/redis');
const prisma = require('./core/prisma');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Initialize Redis
    // await initRedis();

    // 2. Test Prisma Connection (optional, it connects lazily anyway, but good for health check)
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // 3. Start Express Server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Handle unexpected closures
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('\nPrisma Disconnected.');
  process.exit(0);
});
