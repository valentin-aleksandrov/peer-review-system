import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { CoreModule } from "./core/core.module";
import { HomeComponent } from "./home/home.component";
import { RegisterComponent } from "./components/register/register.component";
import { SharedModule } from "./shared/shared.module";
import { LoginComponent } from "./components/login/login.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { JwtInterceptor } from "./interceptors/auth-interceptor";
import { RequestsNavComponent } from "./pullRequests/requests-nav/requests-nav.component";
import { RequestsTableComponent } from "./pullRequests/requests-table/requests-table.component";
import { SearchBarComponent } from "./pullRequests/search-bar/search-bar.component";
import { AutocompleteComponent } from "./pullRequests/autocomplete/autocomplete.component";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent
  ],
  imports: [BrowserModule, AppRoutingModule, CoreModule, SharedModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
