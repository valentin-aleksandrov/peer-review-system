import { PullRequestsRoutingModule } from "./pull-requests-routing.module";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { NgModule } from "@angular/core";
import { PullRequestsComponent } from "./pull-requests.component";
import { CreateWorkItemComponent } from "./create/create-work-item.component";
import { FroalaEditorModule, FroalaViewModule } from "angular-froala-wysiwyg";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { ReviewerItemComponent } from "./reviewerItem/reviewer-item-component";
import { SimpleWorkItemComponent } from "./simpleWorkItem/simple-work-item.component";
import { ItemDetails } from "./itemDetails/item-details.component";
import { ItemComment } from "./itemComment/item-comment.component";
import { DisplayComment } from "./comments/display-comment.component";
import { RequestsNavComponent } from "./requests-nav/requests-nav.component";
import { RequestsTableComponent } from "./requests-table/requests-table.component";
import { SearchBarComponent } from "./search-bar/search-bar.component";
import { AutocompleteComponent } from "./autocomplete/autocomplete.component";
import { SearchWorkitemsComponent } from "./search-workitems/search-workitems.component";
import { WorkitemsTableComponent } from "./workitems-table/workitems-table.component";

@NgModule({
  declarations: [
    PullRequestsComponent,
    CreateWorkItemComponent,
    ReviewerItemComponent,
    SimpleWorkItemComponent,
    ItemDetails,
    ItemComment,
    DisplayComment,
    RequestsNavComponent,
    RequestsTableComponent,
    SearchBarComponent,
    AutocompleteComponent,
    SearchWorkitemsComponent,
    WorkitemsTableComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    PullRequestsRoutingModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class PullRequestsModule {}
