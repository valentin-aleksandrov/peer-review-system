import { Injectable } from '@nestjs/common';
import { EmailService } from './notifications/email.service';

@Injectable()
export class AppService {
  constructor(private readonly emailService: EmailService) {
    
  }
  getHello(): string {
    this.emailService.sendEmail('valentin805@gmail.com','This is a subject', 'This is the text of the email');
    return 'Hello World!';
  }
}
