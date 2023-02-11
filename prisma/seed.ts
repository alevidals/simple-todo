import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await db.user.create({
    data: {
      username: "test",
      passwordHash:
        "$2a$10$5o1OTdOfAQEAL1zeJMx7PuTATSYhmCgUtTMq5jjn4Yo3nGMLtK0Ie",
    },
  });
}

seed();
