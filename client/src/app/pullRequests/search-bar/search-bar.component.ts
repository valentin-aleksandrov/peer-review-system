import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { User } from "src/app/models/user";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { UserDetails } from "src/app/models/user-details";
import { WorkItemDataService } from "src/app/core/services/work-item-data.service";
import { Tag } from "src/app/models/tag";
import { TeamService } from "src/app/core/services/team.service";
import { AuthenticationService } from "src/app/core/services/authentication.service";
import { Team } from "src/app/models/team";
import { FormGroup, FormBuilder } from "@angular/forms";
import { createUrlResolverWithoutPackagePrefix } from "@angular/compiler";
import { WorkItem } from "src/app/models/work-item";

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.css"]
})
export class SearchBarComponent implements OnInit {
  @Output() updateSearchResults = new EventEmitter<WorkItem[]>();
  public users: UserDetails[];
  public userNames: string[] = [];
  public tags: Tag[];
  public currentUser: UserDetails;
  public teams: Team[];
  public teamNames: string[] = [];
  public searchForm: FormGroup;
  chosenTag: string = "";
  chosenStatus: string = "";
  empty: boolean = false;
  // public status: WorkItemStatus[];
  constructor(
    private readonly workItemDataService: WorkItemDataService,
    private readonly teamService: TeamService,
    private readonly authenticationService: AuthenticationService,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      title: [""],
      author: [""],
      asignee: [""],
      team: [""]
    });
    this.currentUser = this.authenticationService.currentUserValue.user;
    this.workItemDataService.getUsers().subscribe((users: UserDetails[]) => {
      this.users = users;
      for (const user of users) {
        const name = user.username;
        this.userNames.push(name);
      }
      this.userNames.push(this.currentUser.username);
    });

    this.workItemDataService.getTags().subscribe((tags: Tag[]) => {
      this.tags = tags;
    });

    this.teamService
      .getTeamsByUserId(this.currentUser.id)
      .subscribe((teams: Team[]) => {
        this.teams = teams;
        for (const team of teams) {
          const teamName = team.teamName;
          this.teamNames.push(teamName);
        }
      });
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
          : this.teamNames
              .filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
      )
    );

  formatterTeam = (result: string) => result;

  public changeTag(tag: string) {
    this.chosenTag = tag;
  }

  public changeStatus(status: string) {
    this.chosenStatus = status;
  }

  searchForWorkitems() {
    const title = this.searchForm.value["title"];
    const author = this.searchForm.value["author"];
    const asignee = this.searchForm.value["asignee"];
    const team = this.searchForm.value["team"];
    const tag = this.chosenTag;
    const status = this.chosenStatus;
    let urlStr = "";
    if (title) {
      urlStr += `?title=${title}&`;
    }
    if (author) {
      urlStr += `?author=${author}&`;
    }
    if (asignee) {
      urlStr += `?asignee=${asignee}&`;
    }
    if (team) {
      urlStr += `?team=${team}&`;
    }
    if (tag) {
      urlStr += `?tag=${tag}&`;
    }
    if (status) {
      urlStr += `?status=${status}&`;
    }

    this.workItemDataService
      .getSelectedWorkItems(urlStr)
      .subscribe((data: WorkItem[]) => {
        if (!(data && data.length)) {
          this.empty = true;
        }
        this.updateSearchResults.emit(data);
      });
  }
}
