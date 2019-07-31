import { Component, OnInit } from "@angular/core";
import { NgbTypeaheadConfig } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { WorkItemDataService } from "src/app/core/services/work-item-data.service";
import { UserDetails } from "src/app/models/user-details";
import { AuthenticationService } from "src/app/core/services/authentication.service";
import { User } from "src/app/models/user";
import { Tag } from "src/app/models/tag";
import { TeamService } from "src/app/core/services/team.service";
import { SimpleTeamInfo } from "src/app/models/simple-team-info";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CreateWorkItem } from "src/app/models/create-work-item";
import { Router, ActivatedRoute } from "@angular/router";
import { Team } from "src/app/models/team";
import { NgxFileDropEntry, FileSystemFileEntry } from "ngx-file-drop";
import { Alert } from "selenium-webdriver";

@Component({
  selector: "create-work-item",
  templateUrl: "./create-work-item.component.html",
  styleUrls: ["./create-work-item.component.css"],
  providers: [NgbTypeaheadConfig] // add NgbTypeaheadConfig to the component providers -> found workaround
  // This is not a good practice
})
export class CreateWorkItemComponent implements OnInit {
  public createWorkItemForm: FormGroup;
  public isSubmitted: boolean = false;
  public chosenTeam: Team = new Team("Choose a team");
  public model: any;
  public addedUsernames: UserDetails[] = [];
  public title: string;
  public files: NgxFileDropEntry[] = [];
  public teamNames: string[];
  public loggedUser: UserDetails = new UserDetails();
  public users: UserDetails[] = [];
  public tags: Tag[] = [];
  public userTeams: Team[] = [];
  public selectedItems: Tag[] = [];
  public dropdownSettings = {};
  private readonly MAX_FILE_SIZE: number = 20000000;

  constructor(
    private readonly workItemDataService: WorkItemDataService,
    private readonly authenticationService: AuthenticationService,
    private readonly teamService: TeamService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {}
  ngOnInit() {
    this.loggedUser = this.authenticationService.currentUserValue.user;
    this.activatedRoute.data.subscribe(data => {
      this.users = data.users;
      this.userTeams = data.teams;
      this.teamNames = this.userTeams.map((team: Team) => team.teamName);
      this.tags = data.tags;
    });
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField: "name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.createWorkItemForm = this.formBuilder.group({
      title: ["", [Validators.required, Validators.minLength(3)]],
      reviwer: ["", []],
      tagControl: ["", []],
      editorModel: ["", [Validators.required, Validators.minLength(17)]]
      // password: ['', [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}")]]
    });
  }

  public get formControls() {
    return this.createWorkItemForm.controls;
  }
  onItemSelect(item: any) {}
  onSelectAll(items: any) {}

  public changeTeam(chosenTeam: Team) {
    // const foundteam = this.userTeams
    //   .find((team: Team)=>team.teamName===chosenTeam);
    this.chosenTeam = chosenTeam;
  }

  public options: Object = {
    placeholderText: "Write description",
    charCounterCount: false,
    events: {
      "froalaEditor.focus": function(e, editor) {}
    }
  };

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term =>
        term === ""
          ? []
          : this.users
              .filter(
                v => v.username.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
      /* debounceTime(200),
      map(term => term === '' ? []
        : statesWithFlags.filter(v => v.name.toLowerCase()
          .indexOf(term.toLowerCase()) > -1).slice(0, 10))*/
    );

  formatter = (x: { username: string }) => x.username;

  public addUsername() {
    const index = this.findIndex(this.users, this.model);
    this.addedUsernames.push(this.model);
    this.users.splice(index, 1);
    this.model = {};
  }
  public notEnoughRequevwerAdded(): boolean {
    return (
      this.addedUsernames.length < this.chosenTeam.rules.minNumberOfReviewers
    );
  }

  public removeReviewer(event: UserDetails) {
    const index = this.findIndex(this.addedUsernames, event);
    this.addedUsernames.splice(index, 1);
    this.users.push(event);
  }
  private findIndex(arr, user: UserDetails): number {
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      if (element.id === user.id) {
        return i;
      }
    }
    return -1;
  }
  public createWorkItem() {
    this.isSubmitted = true;
    if (this.createWorkItemForm.invalid) {
      return;
    }

    if (!this.chosenTeam.rules || this.notEnoughRequevwerAdded()) {
      return;
    }

    const reviewers: { username: string }[] = this.addedUsernames.map(
      reviewer => ({ username: reviewer.username })
    );
    const tags: { name: string }[] = this.selectedItems.map((tag: Tag) => ({
      name: tag.name
    }));

    const createdWorkItem: CreateWorkItem = {
      description: this.createWorkItemForm.value.editorModel,
      reviewers: reviewers,
      team: this.chosenTeam.teamName,
      title: this.title,
      tags: tags
    };

    this.workItemDataService.createWorkItem(createdWorkItem).subscribe(data => {
      console.log("Created work item:", data);
      const formData = new FormData();

      for (const file of this.files) {
        if (file.fileEntry.isFile) {
          const fileEntry = file.fileEntry as FileSystemFileEntry;
          fileEntry.file((currentFile: File) => {
            console.log(currentFile.type);
            formData.append("files", currentFile);
          });
        }
      }
      this.workItemDataService
        .attachedFilesToWorkItem(data.id, formData)
        .subscribe(workItem => {
          this.router.navigate([`/pullRequests/${data.id}`]);
          console.log(workItem);
        });
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
      if (foundIndex >= 0) {
        if (confirm("Are you sure to replace " + file.relativePath + " ?")) {
          this.files.splice(foundIndex, 1);
          this.files.push(file);
        }
      } else {
        this.files.push(file);
      }
    }
  }
  public removeFile(item: NgxFileDropEntry): void {
    this.files = this.files.filter(
      file => file.relativePath !== item.relativePath
    );
  }
  public filesToShow(): boolean {
    return this.files.length > 0;
  }
}
