import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BookService } from 'src/app/services/book-service/book.service';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  loginForm !:FormGroup 
  dialogRef!: MatDialogRef<any>;

  constructor(private formBuilder:FormBuilder,private userService: UserService, private router : Router,private bookService: BookService){

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
