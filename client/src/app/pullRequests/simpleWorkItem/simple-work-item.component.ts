import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserDetails } from 'src/app/models/user-details';
import { WorkItem } from 'src/app/models/work-item';

@Component({
    selector: 'simple-work-item',
    templateUrl: './simple-work-item.component.html',
    styleUrls: ['./simple-work-item.component.css'],
  })
  export class SimpleWorkItemComponent{
    @Input()
    workItem :WorkItem;

  }