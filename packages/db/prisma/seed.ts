import * as dotenv from 'dotenv';
dotenv.config(); // Load local .env
dotenv.config({ path: '../../.env' }); // Fallback to root .env
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

console.log("DATABASE_URL is:", process.env.DATABASE_URL ? "defined" : "undefined");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Create an initial user
  const user = await prisma.user.upsert({
    where: { email: 'admin@devforge.com' },
    update: {},
    create: {
      email: 'admin@devforge.com',
      username: 'devforge_admin',
      name: 'DevForge Admin',
      score: 100,
    },
  });

  console.log(`Created user: ${user.username}`);

  // Create an initial project
  const project = await prisma.project.upsert({
    where: { slug: 'devforge' },
    update: {},
    create: {
      title: 'DevForge',
      slug: 'devforge',
      description: 'The Unified Developer Ecosystem',
      ownerId: user.id,
      projectStatus: 'BUILDING',
    },
  });

  console.log(`Created project: ${project.title}`);

  // Create a tag
  const tag = await prisma.tag.upsert({
    where: { slug: 'architecture' },
    update: {},
    create: {
      name: 'Architecture',
      slug: 'architecture',
      description: 'System design and software architecture',
    },
  });

  console.log(`Created tag: ${tag.name}`);

  // Create an initial build log
  await prisma.buildLog.create({
    data: {
      projectId: project.id,
      authorId: user.id,
      content: 'We just initialized the DevForge monorepo and database schema!',
      status: 'MILESTONE',
      tags: {
        connect: { id: tag.id },
      },
    },
  });

  console.log('Created initial Build Log');
  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
