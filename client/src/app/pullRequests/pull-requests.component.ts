import { Component, OnInit } from "@angular/core";
import { WorkItemDataService } from "../core/services/work-item-data.service";
import { AuthenticationService } from "../core/services/authentication.service";
import { UserDetails } from "../models/user-details";
import { WorkItem } from "../models/work-item";
import { NotificatorConfigService } from '../core/services/notificator-config.service';

// pull-requests.component
@Component({
  selector: "pull-requests",
  templateUrl: "./pull-requests.component.html",
  styleUrls: ["./pull-requests.component.css"]
})
export class PullRequestsComponent implements OnInit {
  
  constructor(
    private readonly notificatorConfigService: NotificatorConfigService,
  ){ }
  
  ngOnInit(): void {
    this.notificatorConfigService.configEngagespotNotificator();
  }
}
