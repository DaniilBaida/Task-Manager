import { PrismaClient } from "../generated/prisma";
import { faker } from "@faker-js/faker";
const prisma = new PrismaClient();

const userIds = [
    "97d682e5-148c-4c42-b04c-8c1aa04bba71",
    "d83ea2e3-eba4-44ca-bf03-d205be159865",
    "4056241d-7f2c-47a8-9237-1f84f1182241",
];

const capitalize = (word: string): string => {
    return word.charAt(0).toUpperCase() + word.slice(1);
};

async function main() {
    for (const userId of userIds) {
        const createdProject = await prisma.project.create({
            data: {
                user_id: userId,
                name: faker.word.noun(),
            },
        });

        for (let i = 0; i <= 2; i++) {
            await prisma.task.create({
                data: {
                    user_id: userId,
                    project_id: i % 2 == 0 ? createdProject.id : null,
                    name: `${capitalize(faker.word.verb())} ${faker.word.noun()}`,
                    description: faker.lorem.sentence(),
                    due_date: faker.date.future(),
                },
            });
        }
    }
}

main()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
