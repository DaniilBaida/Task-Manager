import { IMailer, IMailNotification } from "../types";

export class ConsoleLogMailer implements IMailer {
    async send(mailNotification: IMailNotification) {
        console.log(mailNotification.text);
    }
}
