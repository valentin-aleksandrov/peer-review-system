import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../core/services/authentication.service';
import { NotificatorConfigService } from '../core/services/notificator-config.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
  })
  export class HomeComponent implements OnInit{
    constructor(
      private readonly notificatorConfigService: NotificatorConfigService,
      private readonly authenticationService: AuthenticationService,
      ){
      
    }
    ngOnInit(): void {
      this.notificatorConfigService.configEngagespotNotificator();
    }
    
  }