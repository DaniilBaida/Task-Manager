import config from "@/shared/config/config";
import { ITaskCreatePayload } from "@/infrastructure/database/repositories/types";
import logger from "@/shared/logger";
import { IMailer } from "@/core/services/notification/types";
import { taskService } from "@/core/services/task";

export class CreateTaskUseCase {
    constructor(protected mailer: IMailer) {}

    async execute(payload: ITaskCreatePayload, userId: string) {
        const task = await taskService.createTask(payload, userId);

        this.mailer
            .send({
                to: config.MAIL.ADMIN_EMAIL,
                subject: "New Task",
                text: `Task '${task.name}' was created and is ready for your review`,
            })
            .catch((error) => logger.error(error));

        return task;
    }
}
