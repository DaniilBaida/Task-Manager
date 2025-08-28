import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
const prisma = new PrismaClient();

const userIds = ["y7g4iS5HkjDRkYLpcLvGH1CBb72IlS73@clients"];

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
