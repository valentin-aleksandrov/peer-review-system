import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../core/services/authentication.service';
import { Subscription } from 'rxjs';
import { User } from '../models/user';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { TeamService } from '../core/services/team.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public createTeamForm: FormGroup;
  public currentUser: User;
  public isSubmitted: boolean = true;
  public subscription: Subscription;
  public sendInvite: boolean = false;
  myCheckbox: FormControl = new FormControl();
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly teamService: TeamService,
    private readonly formBuilder: FormBuilder
  ) {
    this.subscription = this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    console.log(this.currentUser);
   }

  ngOnInit() {
    this.createTeamForm = this.formBuilder.group ({
      teamName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      rule: this.formBuilder.group({
      minPercentApprovalOfItem: ['', [Validators.required, Validators.min(50), Validators.max(100)]],
      minNumberOfReviewers: ['', [Validators.required, Validators.min(2)]]
    })
    });

//     this.myCheckbox.valueChanges.subscribe(value=> {
//       console.log('my chebox has changed', value);
// })
  }

  get formControls() { return this.createTeamForm.controls; }

  public toggleInvitation() {
    this.sendInvite = true;
  }

  public createTeam() {
    this.isSubmitted = !this.isSubmitted;

    if (this.createTeamForm.invalid) {
      return;
    }
    this.teamService.createNewTeam(this.createTeamForm.value).pipe(first()).subscribe(data => {
      console.log(data);
    })
  }

  public setRulesToDefault() {
    this.createTeamForm.controls.rule.setValue({minNumberOfReviewers: 3, minPercentApprovalOfItem: 100});
}
}
