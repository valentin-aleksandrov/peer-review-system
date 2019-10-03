import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SearchBarComponent } from "./search-bar.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { WorkItemDataService } from "src/app/core/services/work-item-data.service";
import { AuthenticationService } from "src/app/core/services/authentication.service";
import { NgbTypeahead, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Title } from "@angular/platform-browser";
import { User } from "src/app/models/user";
import { UserDetails } from "src/app/models/user-details";
import { of } from "rxjs";

describe("SearchBarComponent", () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let users: UserDetails[];
  const authenticationServiceSpy = jasmine.createSpyObj(
    "AuthenticationService",
    ["login", "currentUser", "currentUserValue"]
  );
  let user1: UserDetails = {
    avatarURL: "string",
    email: "test@test.bg",
    firstName: "Gosho",
    id: "id",
    lastName: "Goshev",
    role: "member",
    username: "Gosho"
  };
  let user2: UserDetails = {
    avatarURL: "string",
    email: "test2@test.bg",
    firstName: "Pesho",
    id: "id",
    lastName: "Peshev",
    role: "member",
    username: "Pesho"
  };
  users = [user1, user2];
  const workItemDataServiceSpy = jasmine.createSpyObj("workItemDataService", [
    "getUsers"
  ]);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchBarComponent],
      providers: [
        { provide: WorkItemDataService, useValue: workItemDataServiceSpy },
        { provide: AuthenticationService, useValue: authenticationServiceSpy }
      ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        NgbModule,
        HttpClientTestingModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;

    const authSpy = fixture.debugElement.injector.get(AuthenticationService);
    users = [user1, user2];
    //fixture.detectChanges();
    //component.ngOnInit();
  });

  afterEach(() => {
    if (fixture.nativeElement && "remove" in fixture.nativeElement) {
      (fixture.nativeElement as HTMLElement).remove();
    }
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // it("search form invalid when empty", () => {
  //   component.ngOnInit();
  //   expect(component.searchForm.valid).toBeFalsy();
  // });

  // it("email field validity", () => {
  //   component.ngOnInit();
  //   let email = component.searchForm.controls["title"];
  //   expect(title.valid).toBeFalsy();
  // });
  it("current User to be undifined before initialization", () => {
    expect(component.currentUser).toBeUndefined();
  });

  it("something else", async () => {
    const users$ = {
      user: {
        id: "b65966e2-d124-4af9-aa5a-c0db47167567",
        username: "Steli",
        email: "carmen99@abv.bg",
        firstName: "Stiliana",
        lastName: "Georgieva",
        role: "admin",
        avatarURL: "https://i.ibb.co/9vrDM7Y/image1.jpg"
      },
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI2NTk2NmUyLWQxMjQtNGFmOS1hYTVhLWMwZGI0NzE2NzU2NyIsImVtYWlsIjoiY2FybWVuOTlAYWJ2LmJnIiwidXNlcm5hbWUiOiJTdGVsaSIsInJvbGUiOiJhZG1pbiIsImZpcnN0TmFtZSI6IlN0aWxpYW5hIiwibGFzdE5hbWUiOiJHZW9yZ2lldmEiLCJhdmF0YXJVUkwiOiJodHRwczovL2kuaWJiLmNvLzl2ckRNN1kvaW1hZ2UxLmpwZyIsImlhdCI6MTU2NTA4MjIzMywiZXhwIjoxNTY1MDg1ODMzfQ.VsEGWuDnvv8qJm-Wibu53dQhNzoSqoUW8w5qlylAGSI"
    };
    authenticationServiceSpy.currentUserValue = of(users$);
    fixture = TestBed.createComponent(SearchBarComponent);
    const app = fixture.debugElement.componentInstance;
    let oAuth2Service: AuthenticationService = TestBed.get(
      AuthenticationService
    );
    oAuth2Service.currentUserValue().subscribe(state => {
      expect(state).toEqual(false);
      done();
    });

    await fixture.detectChanges();
    component.ngOnInit();
    expect(component.currentUser).toBeTruthy();
  });
});
