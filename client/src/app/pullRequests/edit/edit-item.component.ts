import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { UserDetails } from "src/app/models/user-details";
import { WorkItem } from "src/app/models/work-item";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "src/app/core/services/authentication.service";
import { Review } from "src/app/models/review";
import { SubmitComment } from "src/app/models/submit-comment";
import { CommentsDataService } from "src/app/core/services/comments-data.service";
import { Comment } from "src/app/models/comment";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "edit-item",
  templateUrl: "./edit-item.component.html",
  styleUrls: ["./edit-item.component.css"],
  providers: [NgbTypeaheadConfig],
})
export class EditItem implements OnInit {
  public workItem: WorkItem;
  public updateWorkItemForm: FormGroup;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data)=>{
      this.workItem = data.workItem;
    });
    console.log(this.workItem);
    this.updateWorkItemForm = this.formBuilder.group({
      title: [this.workItem.title, [Validators.required, Validators.minLength(3)]],
      reviwer: ["", []],
      tagControl: ["", []],
      editorModel: ["",[Validators.required, Validators.minLength(17)]]
    });
  }
}
