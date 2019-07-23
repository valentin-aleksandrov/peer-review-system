import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UserDetails } from 'src/app/models/user-details';
import { WorkItem } from 'src/app/models/work-item';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Reviewer } from 'src/app/models/reviewer';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'item-comment',
    templateUrl: './item-comment.component.html',
    styleUrls: ['./item-comment.component.css'],
  })
  export class ItemComment implements OnInit{
    public commentValue: string;
    public radioGroupForm: FormGroup;
    constructor(

    ){}

    ngOnInit(): void {
      this.radioGroupForm = this.formBuilder.group({
        'model': 1
      });
    }
  }