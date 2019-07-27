import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/user";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { UserDetails } from "src/app/models/user-details";
import { WorkItemDataService } from "src/app/core/services/work-item-data.service";
import { Tag } from "src/app/models/tag";
import { TeamService } from "src/app/core/services/team.service";
import { AuthenticationService } from "src/app/core/services/authentication.service";
import { Team } from "src/app/models/team";

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.css"]
})
export class SearchBarComponent implements OnInit {
  public users: UserDetails[];
  public userNames: string[] = [];
  public tags: Tag[];
  public currentUser: UserDetails;
  public teams: Team[];
  // public status: WorkItemStatus[];
  constructor(
    private readonly workItemDataService: WorkItemDataService,
    private readonly teamService: TeamService,
    private readonly authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUserValue.user;
    this.workItemDataService.getUsers().subscribe((users: UserDetails[]) => {
      this.users = users;
      for (const user of users) {
        const name = user.username;
        this.userNames.push(name);
      }
    });

    this.workItemDataService.getTags().subscribe((tags: Tag[]) => {
      this.tags = tags;
    });

    this.teamService
      .getTeamsByUserId(this.currentUser.id)
      .subscribe((teams: Team[]) => {
        this.teams = teams;
        console.log(teams);
        console.log(teams[0].teamName);
      });

    // this.workItemDataService.get).subscribe((data) =>{}

    // )
  }
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term =>
        term === ""
          ? []
          : this.userNames
              .filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
      )
    );

  formatter = (result: string) => result;

  teamSearch = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term =>
        term === ""
          ? []
          : this.teams
              .filter(
                v => v.teamName.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
    );

  formatterTeam = (x: { teamname: string }) => x.teamname;
}
