import config from "@/config/config";
import { IMailer } from "./interface";
import { mailer as MailtrapMailer } from "./mailtrap-mailer";
import { mailer as ConsoleLogMailer } from "./console-log-mailer";

let mailer: IMailer = MailtrapMailer;

if (config.CONSOLE_LOG_EMAILS) {
    mailer = ConsoleLogMailer;
}

export { mailer };
