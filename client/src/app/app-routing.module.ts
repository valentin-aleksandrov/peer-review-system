import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  //{ path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'pullRequests',
    loadChildren: './pullRequests/pull-requests.module#PullRequestsModule',
    //'./users/users.module#UsersModule',
  },
  { 
    path: 'profile',
    loadChildren: './profile/profile.module#ProfileModule',
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
