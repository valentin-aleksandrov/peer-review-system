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
