// import { async, ComponentFixture, TestBed } from "@angular/core/testing";

// import { ProfileComponent } from "./profile.component";
// import { AuthenticationService } from "../core/services/authentication.service";
// import { Router } from "@angular/router";
// import { ReactiveFormsModule, FormsModule } from "@angular/forms";

// describe("ProfileComponent", () => {
//   let component: ProfileComponent;
//   let fixture: ComponentFixture<ProfileComponent>;
//   const authenticationServiceSpy = jasmine.createSpyObj(
//     "AuthenticationService",
//     ["login"]
//   );
//   const routerSpy = jasmine.createSpyObj("Router", ["navigateByUrl"]);

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         { provide: Router, useValue: routerSpy },
//         { provide: AuthenticationService, useValue: authenticationServiceSpy }
//       ],
//       imports: [ReactiveFormsModule, FormsModule],
//       declarations: [ProfileComponent]
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ProfileComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it("should create", () => {
//     expect(component).toBeTruthy();
//   });
// });
