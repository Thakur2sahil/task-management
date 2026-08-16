import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL,
// });

const adapter = new PrismaPg(
  {
    connectionString: process.env.DATABASE_URL,
  },
  {
    schema: "task_manager",
  }
);

export const prisma = new PrismaClient({
  adapter,
});