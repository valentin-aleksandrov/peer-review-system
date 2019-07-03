import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;
  public isSubmitted: false;
  constructor(private readonly formBuilder: FormBuilder) { }

  ngOnInit() {
   
    this.registerForm = this.formBuilder.group ({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', Validators.required, Validators.email],
        username: ['', Validators.required],
        password: ['', Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}')] 
      });
  }

  get formControls() { return this.registerForm.controls; }

}
