import { Component, OnInit } from '@angular/core';
import { NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { WorkItemDataService } from 'src/app/core/services/work-item-data.service';
import { UserDetails } from 'src/app/models/user-details';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { User } from 'src/app/models/user';
import { Tag } from 'src/app/models/tag';
import { TeamService } from 'src/app/core/services/team.service';
import { SimpleTeamInfo } from 'src/app/models/simple-team-info';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreateWorkItem } from 'src/app/models/create-work-item';
import { Router } from '@angular/router';




const states = ['valentin','valka1','valka2','valka3','valka4','valka5'];
const tags = ['computers','sports','cooking','bikes'];
const statesWithFlags: {name: string, flag: string}[] = [
  {'name': 'Alabama', 'flag': '5/5c/Flag_of_Alabama.svg/45px-Flag_of_Alabama.svg.png'},
  {'name': 'Alaska', 'flag': 'e/e6/Flag_of_Alaska.svg/43px-Flag_of_Alaska.svg.png'},
  {'name': 'Arizona', 'flag': '9/9d/Flag_of_Arizona.svg/45px-Flag_of_Arizona.svg.png'},
  {'name': 'Arkansas', 'flag': '9/9d/Flag_of_Arkansas.svg/45px-Flag_of_Arkansas.svg.png'},
  {'name': 'California', 'flag': '0/01/Flag_of_California.svg/45px-Flag_of_California.svg.png'},
];

@Component({
    selector: 'create-work-item',
    templateUrl: './create-work-item.component.html',
    styleUrls: ['./create-work-item.component.css'],
    providers: [NgbTypeaheadConfig] // add NgbTypeaheadConfig to the component providers -> found workaround
    // This is not a good practice
  })
  export class CreateWorkItemComponent implements OnInit{
    public createWorkItemForm: FormGroup;
    title: string;
    chosenTeam: string = 'Choose a team.';
    loggedUser: UserDetails = new UserDetails();
    users: UserDetails[] = [];
    tags: Tag[] = [];
    userTeams: SimpleTeamInfo[] = [];
    dropdownList = [];
  selectedItems: Tag[] = [];
  dropdownSettings = {};
  ngOnInit() {
    this.loggedUser = this.authenticationService.currentUserValue.user;
    console.log(this.loggedUser);
    
    this.workItemDataService.getUsers().subscribe((users:UserDetails[])=>{
      this.users = users;
    });
    
    this.teamService.getTeamsByUserId(this.loggedUser.id).subscribe(
      (teams: SimpleTeamInfo[])=> {
        this.userTeams = teams;
      });
    
    this.workItemDataService.getTags().subscribe((data)=>{
      this.tags = data;
    
      
    });
    

    this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }
    ];
    this.selectedItems = [
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.createWorkItemForm = this.formBuilder.group ({
      title: ['', [Validators.required]],
      reviwer: ['', []],
      tagControl: ['', []]
     // password: ['', [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}")]]
    });
  }

  constructor(
    private readonly workItemDataService: WorkItemDataService,
    private readonly authenticationService: AuthenticationService,
    private readonly teamService: TeamService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    ){ }

      public get formControls() { return this.createWorkItemForm.controls; }
  onItemSelect(item: any) {

  }
  onSelectAll(items: any) {
 
  }

  public changeTeam(team: SimpleTeamInfo){
    this.chosenTeam = team.teamName;
  }

  

    public options: Object = {
      placeholderText: 'Write description',
      charCounterCount: false,
      events : {
        'froalaEditor.focus' : function(e, editor) {
        }
      }
    }
    
    public editorContent: string;
    public model: any;
    public addedUsernames: UserDetails[] = [];

    
    
    search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.users.filter(v => v.username.toLowerCase()
        .indexOf(term.toLowerCase()) > -1).slice(0, 10))
     /* debounceTime(200),
      map(term => term === '' ? []
        : statesWithFlags.filter(v => v.name.toLowerCase()
          .indexOf(term.toLowerCase()) > -1).slice(0, 10))*/
    )

  formatter = (x: {username: string}) => x.username;

  public addUsername(){
    const index = this.findIndex(this.users,this.model);
    this.addedUsernames.push(this.model);
    this.users.splice(index,1);
    this.model = {};
  }

  public removeReviewer(event: UserDetails){
    const index = this.findIndex(this.addedUsernames,event);
    this.addedUsernames.splice(index,1);
    this.users.push(event);
  }
  private findIndex(arr, user: UserDetails): number{
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      if(element.id === user.id){
        return i;
      }
    }
    return -1;
  }
  public createWorkItem(){
    const reviewers: {username: string}[] = this.addedUsernames.map((reviewer)=>({username: reviewer.username}));
    const tags: {name: string}[] = this.selectedItems.map((tag: Tag)=>({name: tag.name}))
  

    const createdWorkItem: CreateWorkItem = {
      description: this.editorContent,
      reviewers: reviewers,
      team: this.chosenTeam,
      title: this.title,
      tags: tags,
    };
    
    this.workItemDataService.createWorkItem(createdWorkItem).subscribe((data)=>{
      console.log(data);
      this.router.navigate(['/home']);
    });
  }
}