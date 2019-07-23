import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { first } from "rxjs/operators";
import { AuthenticationService } from "src/app/core/services/authentication.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public isSubmitted: boolean = false;
  public invalidInput: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}"
          )
        ]
      ]
    });
  }

  get formControls() {
    return this.loginForm.controls;
  }

  logInUser() {
    if (this.loginForm.invalid) {
      this.isSubmitted = true;
    }
    this.authenticationService
      .login(this.loginForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(["/home"]);
        },
        error => {
          this.invalidInput = true;
        }
      );
  }
}
