import { Injectable } from "@nestjs/common";
import { MailerService } from "@nest-modules/mailer";

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
  ) { }

  public sendEmail(to: string, subject: string, text: string): void {
    this
      .mailerService
      .sendMail({
        to: to, 
        subject: subject, 
        text: text, 
        html: `<b>${text}</b>`, 
      })
      .then((success) => {
          console.log('Email send.');
      })
      .catch((err) => {
          console.log(err);
      });
  }
}