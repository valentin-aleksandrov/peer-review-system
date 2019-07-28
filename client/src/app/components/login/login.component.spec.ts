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
});
