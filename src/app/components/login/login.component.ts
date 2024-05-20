import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  templist:any;
  cartList:any;
  constructor(private formBuilder:FormBuilder,private userService: UserService, private router : Router,private bookService: BookService,@Inject(MAT_DIALOG_DATA) public data: {value: string,cart:any}
){

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
      
        if(this.data.value=='placeOrder')
          {
            this.templist=this.data.cart;
    
           
            // var v=localStorage.getItem('authToken')+'';
            
            this.bookService.getAllCartDetails(res.token).subscribe((response) => {
              this.cartList = response.data;
            
this.updateCart(this.templist,this.cartList,res.token)
window.location.reload();
            // this.bookService.getAllCartDetails().subscribe(res => {
            //   this.cartList= this.cartList.filter((ele:any)=>{if(ele.quantity>0 && !ele.isUnCarted && !ele.isOrdered) return ele;})  
                  
            //   console.log(this.updateCart(this.templist,this.cartList,localStorage.getItem('authToken')));
            //   window.location.reload()
            },err=>console.log(err)
          )
          }
        
       this.router.navigate(['/dashboard/books'])

    }
    ,err=> console.log(err))

    
    
  }


  updateCart(a: any, b: any,token:string) {
    for (const itemA of a) {
      const itemB = b.find((item:any) => item.bookId === itemA.bookId);
      if (itemB) {
          itemB.quantity += itemA.quantity;
          this.bookService.updateBookQuantity(itemB.bookId,itemB.quantity,token).subscribe(res=>console.log(res)
          
        )

      } else {
          b.push(itemA);
          this.bookService.addBookToCart(itemA.bookId,itemA.quantity,token).subscribe(res=>console.log(res)
          )
      }
  }
  return b;
}

}
