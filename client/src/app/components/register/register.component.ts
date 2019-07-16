import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;
  public isSubmitted: boolean = false;
  constructor(private readonly formBuilder: FormBuilder, private router: Router,
    private authenticationService: AuthenticationService,
) { }

  ngOnInit() {
   
    this.registerForm = this.formBuilder.group ({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}")]]
      });
  }

  get formControls() { return this.registerForm.controls; }



registerUser() {
  this.isSubmitted = true;
  console.log(this.registerForm.invalid);

  if (this.registerForm.invalid) {
    return;
  }
  this.authenticationService.register(this.registerForm.value).pipe(first()).subscribe(data => {
    console.log(data);
    this.router.navigate(['/login']);
  })
}
}
