import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();
console.log(
    "Generated cuid:",
    prisma.$transaction(async () => {
        const id = "test"; // We'll see what gets generated
        return id;
    })
);
export default prisma;
