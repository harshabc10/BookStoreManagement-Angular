import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm !:FormGroup 

  constructor(private formBuilder:FormBuilder,private userService: UserService, private router : Router){

  }

 ngOnInit() {
    this.loginForm = this.formBuilder.group({

      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
      
  } )
  }
  get loginControls() { return this.loginForm.controls; }

  handleLogin() {
    //console.log(this.password);
   
    console.log(this.loginForm.controls)
    if(this.loginForm.invalid){
      return

    }
    const {email,password} = this.loginForm.value
    this.userService.loginApiCall(email,password).subscribe(res=> {
      localStorage.setItem('authToken',res.token)
      localStorage.setItem('userName', res.userName) // Assuming the response includes UserName
        localStorage.setItem('email', res.email)
      

       this.router.navigate(['/dashboard/books'])

    }
    ,err=> console.log(err))

    
  }

}
