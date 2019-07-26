import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { UserDetails } from "src/app/models/user-details";
import { WorkItem } from "src/app/models/work-item";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "src/app/core/services/authentication.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import { SubmitComment } from "src/app/models/submit-comment";

@Component({
  selector: "item-comment",
  templateUrl: "./item-comment.component.html",
  styleUrls: ["./item-comment.component.css"]
})
export class ItemComment implements OnInit {
  public commentValue: string;
  public radioGroupForm: FormGroup;
  public sendReviewForm: FormGroup;
  @Input()
  public isReviewer: boolean = true;
  @Output() commentEmiter = new EventEmitter<SubmitComment>();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    // this.radioGroupForm = this.formBuilder.group({
    //   'model': 'Only comment',
    //   'commentValue': ['', [Validators.required]],
    // });
    this.sendReviewForm = this.formBuilder.group({
      content: ["", [Validators.required]],
      status: ["", [Validators.required]]
    });
  }

  get formControls() {
    return this.sendReviewForm.controls;
  }

  // public getTip(): string {
  //   const status: string = this.radioGroupForm.value["model"];
  //   let tip: string = "";
  //   if (status === "Only comment") {
  //     tip = "Leave a comment without a status.";
  //   } else if (status === "approved") {
  //     tip = "Explain why you approve the work item.";
  //   } else if (status === "requestChanges") {
  //     tip = "Explain what changes you have requested.";
  //   } else if (status === "rejected") {
  //     tip = "Explain why you are rejecting the work item.";
  //   }
  //   return status + ": " + tip;
  // }

  // public submitComment() {
  //   const status: string = this.radioGroupForm.value["model"];
  //   const commentValue: string = this.radioGroupForm.value["commentValue"];
  //   console.log(status);
  //   console.log(commentValue);
  //   const newComment: SubmitComment = {
  //     content: commentValue,
  //     status: status
  //   };
  //   this.commentEmiter.emit(newComment);
  // }

  public submitRequest() {
    const newStatus = this.sendReviewForm.value["status"];
    const comment = this.sendReviewForm.value["content"];
    const newReviewOrComment = {
      content: comment,
      status: newStatus
    };
    this.commentEmiter.emit(newReviewOrComment);
  }
}
