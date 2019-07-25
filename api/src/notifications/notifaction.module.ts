import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { PushNotificationService } from "./push-notification.service";


@Module({
    providers: [
      EmailService, 
      PushNotificationService
    ],
    exports: [
      EmailService, 
      PushNotificationService,
    ],
  })
  export class NotificatorModule { }