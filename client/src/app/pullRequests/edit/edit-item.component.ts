import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { UserDetails } from "src/app/models/user-details";
import { WorkItem } from "src/app/models/work-item";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "src/app/core/services/authentication.service";
import { Review } from "src/app/models/review";
import { SubmitComment } from "src/app/models/submit-comment";
import { CommentsDataService } from "src/app/core/services/comments-data.service";
import { Comment } from "src/app/models/comment";

@Component({
  selector: "edit-item",
  templateUrl: "./edit-item.component.html",
  styleUrls: ["./edit-item.component.css"]
})
export class EditItem implements OnInit {
  constructor(

  ) {}

  ngOnInit(): void {
   
  }
}
