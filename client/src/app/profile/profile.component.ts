import { Component, OnInit, ViewChild } from "@angular/core";
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
import { Router } from "@angular/router";
import { NgbTabset } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
  providers: [NgbTabset]
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
  public errorMessage: string = '';
  @ViewChild("t")
  public tabset: NgbTabset;
  public successfulInvitation: boolean = false;
  public addTeamMembersForm: FormGroup;
  myCheckbox: FormControl = new FormControl();
  userTeamsToggles: boolean[];
  addTeamMembersFormArray: FormGroup[] = [];
  invalidInput: boolean = false;
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly teamService: TeamService,
    private readonly formBuilder: FormBuilder,
    private readonly workItemDataService: WorkItemDataService,
    private readonly router: Router
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

    this.workItemDataService.getUsers().subscribe((data: any) => {
      const users = data;
      for (const user of users) {
        const name = user.username;
        this.addedUsers.push(name);
      }
    });

    this.teamService.showPendingInvitations(this.currentUser.user.id).subscribe(
      (data: any) => {
        const teamInvitations = data;
        for (const invitation of teamInvitations) {
          const teamName = invitation.team.teamName;
          const id = invitation.id;
          this.activeInvitations.push({ name: teamName, invitationId: id });
        }
        console.log(this.activeInvitations);
      },
      error => {
        this.invalidInput = true;
      }
    );
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
      .subscribe(
        data => {
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
          this.tabset.select("tab-selectbyid2");
        },
        error => {
          this.invalidInput = true;
        }
      );

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
    const addInvitationBody = {
      teamName: team.teamName,
      inviteeName: form.value.member
    };
    this.teamService
      .createTeamMemberInvitation(addInvitationBody, this.currentUser)
      .subscribe(
        data => {
          this.successfulInvitation = true;
        },
        error => {
          if (error === "Internal Server Error!") {
            this.invalidInput = true;
          } else {
            this.errorMessage = error;
          }
          
        }
      );
  }

  public acceptInvitation(invitation) {
    this.teamService
      .acceptInvitation(invitation.invitationId)
      .subscribe(data => {
        this.activeInvitations = [];
        this.teamService
          .showPendingInvitations(this.currentUser.user.id)
          .subscribe(
            (data: any) => {
              const teamInvitations = data;
              for (const invitation of teamInvitations) {
                const teamName = invitation.team.teamName;
                const id = invitation.id;
                this.activeInvitations.push({
                  name: teamName,
                  invitationId: id
                });
              }
              this.tabset.select("tab-selectbyid2");
            },
            error => {
              this.invalidInput = true;
            }
          );
      });
  }

  public rejectInvitation(invitation) {
    this.teamService
      .rejectInvitation(invitation.invitationId)
      .subscribe(data => {
        this.activeInvitations = [];
        this.teamService
          .showPendingInvitations(this.currentUser.user.id)
          .subscribe(
            (data: any) => {
              const teamInvitations = data;
              for (const invitation of teamInvitations) {
                const teamName = invitation.team.teamName;
                const id = invitation.id;
                this.activeInvitations.push({
                  name: teamName,
                  invitationId: id
                });
              }
            },
            error => {
              this.invalidInput = true;
            }
          );
      });
    this.tabset.select("tab-selectbyid2");
  }
}
