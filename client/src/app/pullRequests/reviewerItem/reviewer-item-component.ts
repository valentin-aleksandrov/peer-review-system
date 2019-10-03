import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserDetails } from 'src/app/models/user-details';

@Component({
    selector: 'reviewer-item',
    templateUrl: './reviewer-item-component.html',
    styleUrls: ['./reviewer-item-component.css'],
  })
  export class ReviewerItemComponent{
    @Input()
    reviewer: UserDetails = new UserDetails();

    @Output() removeUser = new EventEmitter();

    public removeCurrentReviewer(){
      this.removeUser.emit(this.reviewer);
    }
    
  }