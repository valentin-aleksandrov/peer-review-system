import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserDetails } from 'src/app/models/user-details';
import { WorkItem } from 'src/app/models/work-item';
import { Router } from '@angular/router';

@Component({
    selector: 'item-details',
    templateUrl: './item-details.component.html',
    styleUrls: ['./item-details.component.css'],
  })
  export class ItemDetails{
    constructor(
      private readonly router: Router,
    ){}
  }