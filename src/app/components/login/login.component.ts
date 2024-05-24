import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BookService } from 'src/app/services/book-service/book.service';
import { DataService } from 'src/app/services/data-service/data.service';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  dialogRef!: MatDialogRef<any>;
  templist: any;
  cartList: any;
  wishlist: any;
  tempWishlist: any;
  
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private bookService: BookService,
    private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { value: string; cart: any }
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.dataService.currWishlistBook.subscribe((tempWishlist) => {
      this.tempWishlist = tempWishlist; // Store the wishlist in tempWishlist
    });
  }

  get loginControls() {
    return this.loginForm.controls;
  }

  handleLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    this.userService.loginApiCall(email, password).subscribe(
      (res) => {
        localStorage.setItem('authToken', res.token);
        localStorage.setItem('userName', res.userName); // Assuming the response includes UserName
        localStorage.setItem('email', res.email);

        if (this.data.value == 'placeOrder') {
          this.templist = this.data.cart;

          this.bookService.getAllCartDetails(res.token).subscribe(
            (response) => {
              this.cartList = response.data;
              this.updateCart(this.templist, this.cartList, res.token);
              window.location.reload();
            },
            (err) => console.log(err)
          );

          this.bookService.getAllBooksWishlist(res.token).subscribe(
            (response) => {
              this.wishlist = response.data;
              this.updateWishlist(this.tempWishlist, this.wishlist, res.token);
            },
            (err) => console.log(err)
          );
        }

        this.router.navigate(['/dashboard/books']);
      },
      (err) => console.log(err)
    );
  }

  updateCart(a: any, b: any, token: string) {
    for (const itemA of a) {
      const itemB = b.find((item: any) => item.bookId === itemA.bookId);
      if (itemB) {
        itemB.quantity += itemA.quantity;
        this.bookService
          .updateBookQuantity(itemB.bookId, itemB.quantity, token)
          .subscribe((res) => console.log(res));
      } else {
        b.push(itemA);
        this.bookService
          .addBookToCart(itemA.bookId, itemA.quantity, token)
          .subscribe((res) => console.log(res));
      }
    }
    return b;
  }

  updateWishlist(a: any, b: any, token: string) {
    for (const itemA of a) {
      const itemB = b.find((item: any) => item.bookId === itemA.bookId);
      if (!itemB) {
        // If itemA is not in b, add it to the wishlist
        b.push(itemA);
        this.bookService
          .addAllToWishlist(itemA.bookId, token)
          .subscribe((res) => console.log(res));
      }
    }
  }
}
