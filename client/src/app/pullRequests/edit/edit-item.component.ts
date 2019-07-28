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
import { Tag } from 'src/app/models/tag';
import { WorkItemDataService } from 'src/app/core/services/work-item-data.service';
import { CreateWorkItem } from 'src/app/models/create-work-item';
import { UpdateWorkItem } from 'src/app/models/update-work-item';

@Component({
  selector: "edit-item",
  templateUrl: "./edit-item.component.html",
  styleUrls: ["./edit-item.component.css"],
  providers: [NgbTypeaheadConfig],
})
export class EditItem implements OnInit {
  public workItem: WorkItem;
  public updateWorkItemForm: FormGroup;
  public tags: Tag[] = [];
  public selectedItems: Tag[] = [];
  public dropdownSettings = {};
  public isSubmitted: boolean = false;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly workItemDataService: WorkItemDataService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data)=>{
      this.workItem = data.workItem;
      this.tags = data.tags;
      this.selectedItems = this.workItem.tags;
    });
    this.dropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField: "name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    console.log(this.workItem);
    this.updateWorkItemForm = this.formBuilder.group({
      title: [this.workItem.title, [Validators.required, Validators.minLength(3)]],
      reviwer: ["", []],
      tagControl: [this.workItem.tags, []],
      editorModel: [this.workItem.description,[Validators.required, Validators.minLength(17)]]
    });
  }
  public onItemSelect(item: any) {}
  public onSelectAll(items: any) {}

  public updateWorkItem() {
    console.log('updateWorkItem');
    
    this.isSubmitted = true;
    if (this.updateWorkItemForm.invalid) {
      return;
    }
    const tags: { name: string }[] = this.selectedItems.map((tag: Tag) => ({
      name: tag.name
    }));

    const updateddWorkItem: UpdateWorkItem = {
      description: this.updateWorkItemForm.value.editorModel,
      title: this.updateWorkItemForm.value.title,
      tags: tags,
    };

    this.workItemDataService
      .updateWorkItemById(this.workItem.id,updateddWorkItem) 
      .subscribe(data => {
        console.log(data);
        this.router.navigate(["/home"]);
      });
  }
}
