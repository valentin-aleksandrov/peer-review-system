import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../core/services/authentication.service";
import { Subscription, Observable } from "rxjs";
import { User } from "../models/user";
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
  FormArray
} from "@angular/forms";
import { TeamService } from "../core/services/team.service";
import { first, debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { SimpleTeamInfo } from "../models/simple-team-info";
import { WorkItemDataService } from "../core/services/work-item-data.service";
import { forEach } from "@angular/router/src/utils/collection";

@Component({
  selector: "profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  public createTeamForm: FormGroup;
  public currentUser: User;
  public isSubmitted: boolean = false;
  public subscription: Subscription;
  public sendInvite: boolean = false;
  public userTeams;
  public model: any;
  public addedUsers: string[] = [];
  public activeInvitations: any[] = [];
  public addTeamMembersForm: FormGroup;
  myCheckbox: FormControl = new FormControl();
  userTeamsToggles: boolean[];
  addTeamMembersFormArray: FormGroup[] = [];
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly teamService: TeamService,
    private readonly formBuilder: FormBuilder,
    private readonly workItemDataService: WorkItemDataService
  ) {
    this.subscription = this.authenticationService.currentUser.subscribe(
      x => (this.currentUser = x)
    );
  }

  ngOnInit() {
    this.createTeamForm = this.formBuilder.group({
      teamName: [
        "",
        [Validators.required, Validators.minLength(4), Validators.maxLength(20)]
      ],
      rule: this.formBuilder.group({
        minPercentApprovalOfItem: [
          "",
          [Validators.required, Validators.min(50), Validators.max(100)]
        ],
        minNumberOfReviewers: ["", [Validators.required, Validators.min(2)]]
      })
    });

    this.teamService
      .getTeamsByUserId(this.currentUser.user.id)
      .subscribe((teams: SimpleTeamInfo[]) => {
        this.userTeams = teams;
        this.userTeamsToggles = [];
        this.addTeamMembersFormArray = [];
        teams.forEach(team => {
          this.userTeamsToggles.push(false);
          this.addTeamMembersFormArray.push(
            this.formBuilder.group({ member: ["", Validators.required] })
          );
        });
      });

    // this.addTeamMembersForm = this.formBuilder.group({
    //    member: ["", [Validators.required]]
    // });

    this.workItemDataService.getUsers().subscribe((data: any) => {
      const users = data;
      for (const user of users) {
        const name = user.username;
        this.addedUsers.push(name);
      }
    });

    this.teamService
      .showPendingInvitations(this.currentUser.user.id)
      .subscribe((data: any) => {
        const teamInvitations = data;
        for (const invitation of teamInvitations) {
          const teamName = invitation.team.teamName;
          console.log(teamName);
          this.activeInvitations.push({ name: teamName });
        }
      });
  }

  get formControls() {
    return this.createTeamForm.controls;
  }

  public toggleInvitation(i) {
    this.userTeamsToggles[i] = !this.userTeamsToggles[i];
  }

  public createTeam() {
    this.isSubmitted = !this.isSubmitted;

    if (this.createTeamForm.invalid) {
      return;
    }
    this.teamService
      .createNewTeam(this.createTeamForm.value)
      .pipe(first())
      .subscribe(data => {});
  }

  public setRulesToDefault() {
    this.createTeamForm.controls.rule.setValue({
      minNumberOfReviewers: 3,
      minPercentApprovalOfItem: 100
    });
  }

  formatter = (result: string) => result;

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        term === ""
          ? []
          : this.addedUsers
              .filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
      )
    );

  public sendMemberInvitation(team, form) {
    console.log("input", team, form);
    const addInvitationBody = {
      teamName: team.teamName,
      inviteeName: form.value.member
    };
    console.log(addInvitationBody);
    this.teamService
      .createTeamMemberInvitation(addInvitationBody, this.currentUser)
      .subscribe(data => {
        console.log(data);
      });
  }
}
