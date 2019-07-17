import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../core/services/authentication.service';
import { Subscription } from 'rxjs';
import { User } from '../models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public currentUser: User;
  public subscription: Subscription;
  constructor(
    private readonly authenticationService: AuthenticationService
  ) {
    this.subscription = this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    console.log(this.currentUser);
   }

  ngOnInit() {
  }

}
