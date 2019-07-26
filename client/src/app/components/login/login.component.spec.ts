import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LoginComponent } from "./login.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/core/services/authentication.service";
import { of } from "rxjs";
import { Observable } from "rxjs";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const routerSpy = jasmine.createSpyObj("Router", ["navigateByUrl"]);
  const authenticationServiceSpy = jasmine.createSpyObj(
    "AuthenticationService",
    ["login"]
  );

  class MockLoginData {
    constructor(public token: string, public user: MockUser) {}
  }

  class MockUser {
    constructor(
      public avatarURL: string,
      public email: string,
      public firstName: string,
      public id: string,
      public lastName: string,
      public role: string,
      public username: string
    ) {}
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthenticationService, useValue: authenticationServiceSpy }
      ],
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [LoginComponent]
    }).compileComponents();
    TestBed.get(AuthenticationService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("form invalid when empty", () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it("email field validity", () => {
    let email = component.loginForm.controls["email"];
    expect(email.valid).toBeFalsy();
  });

  it("email field validity", () => {
    let errors = {};
    let email = component.loginForm.controls["email"];
    errors = email.errors || {};
    expect(errors["required"]).toBeTruthy();
  });

  it("email field validity", () => {
    let errors = {};
    let email = component.loginForm.controls["email"];
    email.setValue("test");
    errors = email.errors || {};
    expect(errors["email"]).toBeTruthy();
  });

  // it("submitting a form emits a user", async () => {
  //   //expect(component.loginForm.valid).toBeFalsy();
  //   component.loginForm.controls["email"].setValue("test@test.com");
  //   component.loginForm.controls["password"].setValue("aaaA9!");
  //   //expect(component.loginForm.valid).toBeTruthy();
  //   //const hds = fixture.debugElement.injector.get(AuthenticationService);
  //   let user: MockUser = {
  //     avatarURL: "avatar",
  //     email: "test@test.com",
  //     firstName: "Gosho",
  //     lastName: "Goshev",
  //     role: "admin",
  //     username: "Goshkata",
  //     id: "id"
  //   };
  //   authenticationServiceSpy.login = of("test");
  //   //authenticationServiceSpy.login.pipe = of("");
  //   await fixture.detectChanges();
  //   //const loginSpy = spyOn(hds, "login").and.returnValue(of(user));
  //   // let user: MockUser = {
  //   //   avatarURL: "avatar",
  //   //   email: "test@test.com",
  //   //   firstName: "Gosho",
  //   //   lastName: "Goshev",
  //   //   role: "admin",
  //   //   username: "Goshkata",
  //   //   id: "id"
  //   // };
  //   // let user: MockUser;

  //   //let user = { email: string, password };
  //   // Subscribe to the Observable and store the user in a local variable.
  //   component.logInUser();

  //   // Trigger the login function
  //   //component.logInUser(component.loginForm.value);

  //   // Now we can check to make sure the emitted value is correct
  //   expect(component.logInUser()).toBe("test");
  // });
});
