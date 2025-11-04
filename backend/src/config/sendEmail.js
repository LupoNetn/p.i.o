import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

export const mailerSend = new MailerSend({
    apiKey: process.env.MAILER_SEND_API_KEY,
});

const sentFrom = new Sender("info@domain.com", "prodbypio");

const recipients = [
    new Recipient("recipient@email.com", "Your Client")
];

const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject("This is a Subject")
    .setHtml("Greetings from the team, you got this message through MailerSend.")
    .setText("Greetings from the team, you got this message through MailerSend.");

//