import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  const testUser = await db.user.create({
    data: {
      username: "test",
      passwordHash:
        "$2a$10$5o1OTdOfAQEAL1zeJMx7PuTATSYhmCgUtTMq5jjn4Yo3nGMLtK0Ie",
    },
  });

  await db.profileConfiguration.create({
    data: {
      userId: testUser.id,
    },
  });

  await Promise.all(
    mockTodos().map((todo) => {
      const data = { userId: testUser.id, ...todo };

      return db.todo.create({ data });
    })
  );
}

seed();

function mockTodos() {
  return [
    {
      text: "Read a comic",
    },
    {
      text: "Do a broadcast",
    },
    {
      text: "Read a comic",
    },
    {
      text: "Do a broadcast",
    },
    {
      text: "Read a comic",
    },
    {
      text: "Do a broadcast",
    },
    {
      text: "Read a comic",
    },
    {
      text: "Do a broadcast",
    },
    {
      text: "Read a comic",
    },
    {
      text: "Do a broadcast",
    },
    {
      text: "Read a comic",
    },
    {
      text: "Do a broadcast",
    },
  ];
}
