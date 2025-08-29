import config from "@/shared/config/config";
import { IMailer } from "./types";
import { MailtrapMailer } from "./implementations/MailtrapMailer";
import { ConsoleLogMailer } from "./implementations/ConsoleLogMailer";

let mailer: IMailer = new MailtrapMailer();

if (config.CONSOLE_LOG_EMAILS) {
    mailer = new ConsoleLogMailer();
}

export { mailer };
