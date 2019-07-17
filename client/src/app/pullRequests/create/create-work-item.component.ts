import { Component, OnInit } from '@angular/core';
import { NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { WorkItemDataService } from 'src/app/core/services/work-item-data.service';
import { UserDetails } from 'src/app/models/user-details';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { User } from 'src/app/models/user';
import { Tag } from 'src/app/models/tag';




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
    providers: [NgbTypeaheadConfig] // add NgbTypeaheadConfig to the component providers
  })
  export class CreateWorkItemComponent implements OnInit{
    loggedUser: UserDetails = new UserDetails();
    users: UserDetails[] = [];
    tags: Tag[] = [];
    dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  ngOnInit() {
    this.workItemDataService.getUsers().subscribe((users:UserDetails[])=>{
      this.users = users;
      console.log('users',this.users);
    });

    const user: User = this.authenticationService.currentUserValue;
    this.loggedUser = {
      id: user.id,
      avatarURL: null,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: null,
      username: user.username,
    };
    
    this.workItemDataService.getTags().subscribe((data)=>{
      this.tags = data;
      console.log('tags -> ',this.tags);
      
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
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  constructor(
    private readonly workItemDataService: WorkItemDataService,
    private authenticationService: AuthenticationService,
    ){
    

  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }



  

    public options: Object = {
      placeholderText: 'Write description',
      charCounterCount: false,
      events : {
        'froalaEditor.focus' : function(e, editor) {
          console.log(editor.selection.get());
        }
      }
    }
    
    public editorContent: string;
    public model: any;
    public addedUsernames: any[] = [];
    
    public addUsername(){
      this.addedUsernames.push(this.model);
      this.model = {};
    }
    
    search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : statesWithFlags.filter(v => v.name.toLowerCase()
          .indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formatter = (x: {name: string}) => x.name;


    public showValue(){
      console.log(this.editorContent);
      console.log('maybe a user', this.model);

      
    }

  }