import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PullRequestsComponent } from './pull-requests.component';
import { CreateWorkItemComponent } from './create/create-work-item.component';
import { ItemDetails } from './itemDetails/item-details.component';

const routes: Routes = [
    {
      path: '', component: PullRequestsComponent
    },
    {
      path: 'create', component: CreateWorkItemComponent, pathMatch: 'full'
    },

    { 
      path: ':id', component: ItemDetails, 
    },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PullRequestsRoutingModule {

}
