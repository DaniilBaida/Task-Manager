import config from "@/shared/config/config";
import nodemailer from "nodemailer";
import { IMailer, IMailNotification } from "../types";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export class MailtrapMailer implements IMailer {
    private transporter;

    constructor() {
        const options: SMTPTransport.Options = {
            host: config.MAIL.HOST,
            port: config.MAIL.PORT,
            auth: {
                user: config.MAIL.USERNAME,
                pass: config.MAIL.PASSWORD,
            },
        };
        this.transporter = nodemailer.createTransport(options);
    }

    async send(mailNotification: IMailNotification) {
        await this.transporter.sendMail({
            from: '"Task Manager" <notifications@taskmanager.com>',
            to: mailNotification.to,
            subject: mailNotification.subject,
            text: mailNotification.text,
            html: mailNotification.html,
        });
    }
}
