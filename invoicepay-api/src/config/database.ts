import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


export const initailizeDatabase = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected Successfully");
  } catch (error) {
    console.error(" Database connection failed:", error);
  }
};

export const closeDatabase = async () => {
    await prisma.$disconnect();
    console.log("Database connection closed");
}


export { prisma };
