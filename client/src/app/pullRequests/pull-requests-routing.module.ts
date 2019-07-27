import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PullRequestsComponent } from "./pull-requests.component";
import { CreateWorkItemComponent } from "./create/create-work-item.component";
import { ItemDetails } from "./itemDetails/item-details.component";
import { itemDetailsResolverService } from "./services/item-details-resolver.service";
import { SimpleWorkItemComponent } from "./simpleWorkItem/simple-work-item.component";
import { RequestsTableComponent } from "./requests-table/requests-table.component";
import { AuthGuard } from "../guards/auth-guard";
import { SingleUserResolverService } from "../core/services/profile-resolver.service";
import { SearchBarComponent } from "./search-bar/search-bar.component";

const routes: Routes = [
  {
    path: "",
    component: PullRequestsComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "create",
        component: CreateWorkItemComponent,
        pathMatch: "full"
      },
      {
        path: "all",
        component: RequestsTableComponent,
        resolve: { workItems: SingleUserResolverService },
        pathMatch: "full"
      },
      {
        path: "search",
        component: SearchBarComponent,
        pathMatch: "full"
      },

      {
        path: ":id",
        component: ItemDetails,
        resolve: { workItem: itemDetailsResolverService }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PullRequestsRoutingModule {}
