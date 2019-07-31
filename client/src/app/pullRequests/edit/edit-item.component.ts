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
import { NotificatorConfigService } from 'src/app/core/services/notificator-config.service';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { FileEntity } from 'src/app/models/file-entity';

@Component({
  selector: "edit-item",
  templateUrl: "./edit-item.component.html",
  styleUrls: ["./edit-item.component.css"],
  providers: [NgbTypeaheadConfig],
})
export class EditItem implements OnInit {
  private readonly MAX_FILE_SIZE: number = 20000000;
  public oldFiles: FileEntity[] = [];
  public oldFilesToBeRemove: FileEntity[] = [];
  public files: NgxFileDropEntry[] = [];
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
    private readonly notificatorConfigService: NotificatorConfigService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data)=>{
      this.workItem = data.workItem;
      this.tags = data.tags;
      this.selectedItems = this.workItem.tags;
      this.oldFiles = this.workItem.files;
      console.log('oldfiles---',this.oldFiles.map((f)=>f.fileName));
      
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
    this.notificatorConfigService.configEngagespotNotificator();
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
      filesToBeRemoved: this.oldFilesToBeRemove,
    };

    this.workItemDataService
      .updateWorkItemById(this.workItem.id,updateddWorkItem) 
      .subscribe(data => {
        console.log(data);
        console.log('oldFiles',this.oldFiles);
        console.log('filesToBeRemoved',this.oldFilesToBeRemove);
        console.log('filesToBeUploaded',this.files);
        
        
        
        this.router.navigate([`/pullRequests/${data.id}`]);
      });
  }

  private isFileSizeValid(file): boolean {
    const fileEntry = file.fileEntry as FileSystemFileEntry;
    let isValidSize: boolean = false;

    fileEntry.file((currentFile: File) => {
      if (Number(currentFile.size) < this.MAX_FILE_SIZE) {
        isValidSize = true;
      }
    });

    return isValidSize;
  }

  public onFilesUpload(event: NgxFileDropEntry[]) {
    for (const file of event) {
      if (!this.isFileSizeValid(file)) {
        window.alert(`${file.fileEntry.name} is larger than 20MB.`);
        continue;
      }
      const foundIndex = this.files.findIndex(
        currentFile => currentFile.relativePath === file.relativePath
      );
      const  foundOldFileIndex = this.oldFiles.findIndex(
        (oldFile)=>oldFile.fileName===file.relativePath
      );
      if (foundIndex >= 0) {
        if (confirm("Are you sure to replace " + file.relativePath + " ?")) {
          this.files.splice(foundIndex, 1);
          this.files.push(file);
        }
      } else if(foundOldFileIndex >= 0 ){
        if (confirm("Are you sure to replace " + file.relativePath + " ?")) {
          const oldFileToBeRemove: FileEntity = this.oldFiles.splice(foundOldFileIndex,1)[0];
          this.oldFilesToBeRemove.push(oldFileToBeRemove);
          this.files.push(file);
        }
      }
      
      else {
        this.files.push(file);
      }
    }
  }
  public filesToShow(): boolean {
    if(this.oldFiles.length > 0 || this.files.length > 0){
      return true;
    }
    return false;
  }
  public removeFile(item: NgxFileDropEntry): void {
    this.files = this.files.filter(
      file => file.relativePath !== item.relativePath
    );
  }
  removeOldFile(oldFile: FileEntity): void {
    console.log('oldFileTobeRemoved-->',oldFile);
    console.log(oldFile.fileName);
    
    
    this.oldFiles = this.oldFiles.filter((f)=>f.fileName!==oldFile.fileName);
    this.oldFilesToBeRemove.push(oldFile);
  }
}
