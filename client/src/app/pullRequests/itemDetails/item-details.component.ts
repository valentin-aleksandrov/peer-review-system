import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UserDetails } from 'src/app/models/user-details';
import { WorkItem } from 'src/app/models/work-item';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Reviewer } from 'src/app/models/reviewer';

@Component({
    selector: 'item-details',
    templateUrl: './item-details.component.html',
    styleUrls: ['./item-details.component.css'],
  })
  export class ItemDetails implements OnInit{
    public workItem: WorkItem;
    public loggedUser: UserDetails;  
    public isReviewer: boolean = false;
    public isAssignee: boolean = false;
    constructor(
      private readonly router: Router,
      private readonly activatedRoute: ActivatedRoute,
      private readonly authenticationService: AuthenticationService,
    ){}

    ngOnInit(): void {
      this.activatedRoute.data.subscribe((data) => {
        this.workItem = data.workItem;
      });
      this.loggedUser = this.authenticationService.currentUserValue.user;
      this.updateReviewerAuthority();
      this.updateAssigneeAuthority();
    }

    updateReviewerAuthority(){
      const reviews: Reviewer[] = this.workItem.reviews
      const isUserAReviewer = reviews.some((review)=>review.username===this.loggedUser.username);
      this.isReviewer = isUserAReviewer;
    }

    updateAssigneeAuthority(){
      if(this.workItem.assignee.id === this.loggedUser.id){
        this.isAssignee = true;
      } else {
        this.isAssignee = false;
      }
    }
  }