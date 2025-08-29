import config from "@/config/config";
import { repository } from "@/data/repositories";
import logger from "@/logger";
import { IMailer } from "@/services/mailer/interface";
import { Request } from "express";

export class CreateTaskUseCase {
    constructor(
        protected req: Request,
        protected mailer: IMailer
    ) {}

    async execute() {
        const task = await repository.createTask(
            this.req.body,
            this.req.auth!.payload.sub!
        );
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
