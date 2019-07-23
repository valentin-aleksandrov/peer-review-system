import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UserDetails } from 'src/app/models/user-details';
import { WorkItem } from 'src/app/models/work-item';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Reviewer } from 'src/app/models/reviewer';
import { SubmitComment } from 'src/app/models/submit-comment';
import { CommentsDataService } from 'src/app/core/services/comments-data.service';
import { Comment } from 'src/app/models/comment';

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
      private readonly commentDataService: CommentsDataService,
    ){}

    ngOnInit(): void {
      this.activatedRoute.data.subscribe((data) => {
        this.workItem = data.workItem;
      });
      console.log(this.workItem);
      
      this.loggedUser = this.authenticationService.currentUserValue.user;
      this.updateReviewerAuthority();
      this.updateAssigneeAuthority();
      console.log('isreavewer',this.isReviewer);
    }

    updateReviewerAuthority(){
      const reviews: Reviewer[] = this.workItem.reviews
      const isUserAReviewer = reviews.some((review)=>review.username===this.loggedUser.username);
      this.isReviewer = isUserAReviewer;
      console.log(reviews);
      console.log(this.loggedUser);
      
      
    }

    updateAssigneeAuthority(){
      if(this.workItem.assignee.id === this.loggedUser.id){
        this.isAssignee = true;
      } else {
        this.isAssignee = false;
      }
    }

    onCommentSubmition(event: SubmitComment) {
      console.log(event);
      this.commentDataService
        .addComment(this.workItem.id,event.content)
        .subscribe((createdComment: Comment)=>console.log(createdComment)
      );
      
    }
  }