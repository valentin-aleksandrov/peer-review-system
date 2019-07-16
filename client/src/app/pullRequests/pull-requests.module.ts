import { PullRequestsRoutingModule } from './pull-requests-routing.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { PullRequestsComponent } from './pull-requests.component';
import { CreateWorkItemComponent } from './create/create-work-item.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
@NgModule({
    declarations: [
        PullRequestsComponent,
        CreateWorkItemComponent,
    ],
    imports: [
      SharedModule,
      RouterModule,
      PullRequestsRoutingModule,
      FroalaEditorModule.forRoot(), 
      FroalaViewModule.forRoot()
    ],
  })
  export class PullRequestsModule { }
  