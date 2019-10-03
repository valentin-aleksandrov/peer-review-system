import { Component, OnInit } from "@angular/core";
import { WorkItemDataService } from "src/app/core/services/work-item-data.service";
import { AuthenticationService } from "src/app/core/services/authentication.service";
import { UserDetails } from "src/app/models/user-details";
import { WorkItem } from "src/app/models/work-item";
import { ActivatedRoute } from "@angular/router";
import { NotificatorConfigService } from 'src/app/core/services/notificator-config.service';

@Component({
  selector: "app-requests-table",
  templateUrl: "./requests-table.component.html",
  styleUrls: ["./requests-table.component.css"]
})
export class RequestsTableComponent implements OnInit {
  public loggedUser: UserDetails = new UserDetails();
  public workItems: WorkItem[] = [];

  constructor(
    private readonly workItemDataService: WorkItemDataService,
    private readonly authenticationService: AuthenticationService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly notificatorConfigService: NotificatorConfigService,
  ) {}
  ngOnInit(): void {
    this.loggedUser = this.authenticationService.currentUserValue.user;

    this.activatedRoute.data.subscribe(data => {
      this.workItems = data.workItems;
    });
    this.notificatorConfigService.configEngagespotNotificator();
  }
}
