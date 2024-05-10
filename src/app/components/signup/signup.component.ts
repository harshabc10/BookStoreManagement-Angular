import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signUpForm!: FormGroup; 

  constructor(private formBuilder: FormBuilder,private userService: UserService) { }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      mobileNumber: ['', Validators.required]
    });
  }
  get loginControls() { return this.signUpForm.controls; }

  handleSignUp() {
    if (this.signUpForm.invalid) {
      return;
    }
    const { firstName, email, password, mobileNumber } = this.signUpForm.value;
    const requestBody = {
      firstName: firstName,
      email: email,
      password: password,
      phone:mobileNumber
    };
    this.userService.signUpApiCall(requestBody).subscribe(
      res => console.log(res),
      err => console.log(err)
    );
  }

}
