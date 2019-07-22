import { PullRequestsRoutingModule } from './pull-requests-routing.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { PullRequestsComponent } from './pull-requests.component';
import { CreateWorkItemComponent } from './create/create-work-item.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ReviewerItemComponent } from './reviewerItem/reviewer-item-component';
import { SimpleWorkItemComponent } from './simpleWorkItem/simple-work-item.component';
import { ItemDetails } from './itemDetails/item-details.component';

@NgModule({
    declarations: [
        PullRequestsComponent,
        CreateWorkItemComponent,
        ReviewerItemComponent,
        SimpleWorkItemComponent,
        ItemDetails,
    ],
    imports: [
      SharedModule,
      RouterModule,
      PullRequestsRoutingModule,
      FroalaEditorModule.forRoot(), 
      FroalaViewModule.forRoot(),
      NgMultiSelectDropDownModule.forRoot(),
    ],
  })
  export class PullRequestsModule { }
  