import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    
    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    // public login(username: string, password: string) {
    //     return this.http.post('http://localhost:3000/session', { username, password })
    //     .pipe(map((user: User) => {
            
    //         if (user && user.token) {
    //             localStorage.setItem('token', user.token);
    //             localStorage.setItem('username', user.username);
    //             localStorage.setItem('voted', 'false');
    //             localStorage.setItem('role', user.role)
    //             this.currentUserSubject.next(user);
    //         }
            
    //         return user;
    //     }))
      
        
    // }

    register(user: User) {

      return this.http.post('http://localhost:3000/api/auth/users', user);
  }


}
