import { Injectable } from '@nestjs/common';
import { EmailService } from './notifications/email.service';
import { PushNotificationService } from './notifications/push-notification.service';

@Injectable()
export class AppService {
  constructor(
    private readonly emailService: EmailService,
    private readonly pushNotificationService: PushNotificationService,
    ) {
    
  }
  getHello(): string {
    // this.emailService.sendEmail('valentin805@gmail.com','This is a subject', 'This is the text of the email');
    this.pushNotificationService.sendPushNotfication(
      "This is a test title", // title
      'This is the message', // message
      'Valka',  // username
      'https://github.com/ValkaHonda/peer-review-system' // icon
      ); 
    return 'Hello World!';
  }
}
