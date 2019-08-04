import { Injectable } from "@nestjs/common";
const fetch = require("node-fetch");
@Injectable()
export class PushNotificationService {
  private readonly API_KEY: string = "6pDSiRkXZVcL5O8svvFny6qzGnlNtY";
  constructor() {}
  public sendPushNotfication(
    title: string,
    message: string,
    receiverUsername: string,
    goToURL: string,
  ): void {
    const objectToSend = this.createObjectForPushNotification(
      title,
      message,
      receiverUsername,
      goToURL,
    );
    const key = this.API_KEY;

    fetch("https://api.engagespot.co/2/campaigns", {
      method: "post",
      body: JSON.stringify(objectToSend),
      headers: {
        "Content-Type": "application/json",
        "Api-Key": key,
      },
    })
      .then(res => res.json())
      .then(json => console.log("Push notification send"))
      .catch(err => console.log(err + "It didn't work"));
  }

  private createObjectForPushNotification(
    title: string,
    message: string,
    receiverUsername: string,
    goToURL: string,
  ) {
    return {
      notification: {
        title: title,
        message: message,
        icon:
          "https://cdn-images-1.medium.com/max/1200/1*H-25KB7EbSHjv70HXrdl6w.png",
        url: goToURL,
      },

      campaign_name: "campaign_name",
      send_to: "identifiers",
      identifiers: [receiverUsername],
    };
  }
}
