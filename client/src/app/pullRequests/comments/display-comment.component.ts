import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { UserDetails } from "src/app/models/user-details";
import { WorkItem } from "src/app/models/work-item";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "src/app/core/services/authentication.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SubmitComment } from "src/app/models/submit-comment";

@Component({
  selector: "display-comment",
  templateUrl: "./display-comment.component.html",
  styleUrls: ["./display-comment.component.css"]
})
export class DisplayComment implements OnInit {
  @Input()
  comments: Comment[];
  constructor() {}
  ngOnInit(): void {
    console.log(this.comments);
  }
}
