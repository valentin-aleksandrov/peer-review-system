import { Component, OnInit } from "@angular/core";
import { WorkItemDataService } from "src/app/core/services/work-item-data.service";
import { AuthenticationService } from "src/app/core/services/authentication.service";
import { UserDetails } from "src/app/models/user-details";
import { WorkItem } from "src/app/models/work-item";

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
    private readonly authenticationService: AuthenticationService
  ) {}
  ngOnInit(): void {
    this.loggedUser = this.authenticationService.currentUserValue.user;

    this.workItemDataService
      .getWorkItemsByUserId(this.loggedUser.id)
      .subscribe((workItems: WorkItem[]) => {
        this.workItems = workItems;
      });
  }
}
