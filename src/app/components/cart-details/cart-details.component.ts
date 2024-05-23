import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/services/book-service/book.service';
import { DataService } from 'src/app/services/data-service/data.service';
import { BookObj } from 'src/assets/booksInterface';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DROP_DOWN, LOCATION_ICON } from 'src/assets/svg-icons';
import { LoginSignupComponent } from '../login-signup/login-signup.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.scss']
})
export class CartDetailsComponent implements OnInit {
  showAddressDetails: boolean = false;
  showOrderSummary: boolean = false;
  cartItems: (BookObj & { quantity: number })[] = [];
  count: number = 1;
  authToken: string | null = null;
  orderId!:number

  selectedAddressId: number | null = null;

  onAddressSelected($event: number) {
    this.selectedAddressId = $event;
  }

  constructor(private dataService: DataService, private bookService: BookService,
    iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,
    private router: Router, private dialog: MatDialog) {
    iconRegistry.addSvgIconLiteral("location-icon", sanitizer.bypassSecurityTrustHtml(LOCATION_ICON));
    iconRegistry.addSvgIconLiteral("drop-down-icon", sanitizer.bypassSecurityTrustHtml(DROP_DOWN));
  }

  toggleAddressDetails() {
    if (this.authToken) { // Check if authToken is present
      this.showAddressDetails = !this.showAddressDetails;
    }
  }
  
  toggleOrderSummary() {
    if (this.authToken) { // Check if authToken is present
      this.showOrderSummary = !this.showOrderSummary;
    }
  }
  

  ngOnInit(): void {
    this.authToken = localStorage.getItem('authToken'); // Set authToken from localStorage
    
    if (this.authToken) {
      // Auth token is present, fetch all cart details
      this.bookService.getAllCartDetails().subscribe((response) => {
        this.cartItems = response.data;
      });
    } else {
      // Auth token is not present, get cart items from DataService
      this.dataService.getCartItems().subscribe((cartItems) => {
        this.cartItems = cartItems;
      });
    }
  }
  

  handleCheckout() {
    if (this.authToken) {
      const bookIds = this.cartItems.map(item => item.bookId);
      const addressId = this.selectedAddressId;
      // this.orderId=
  
      // Check if addressId is valid (not null or undefined, and a valid integer)
      if (addressId != null && !isNaN(addressId)) {
        const order = {
          // orderId:this.orderId,
            addressId: addressId,
            bookIds: bookIds
        };
  
        this.bookService.addOrder(order, this.authToken).subscribe(response => {
          // this.orderId=response.data[0]
          console.log('Order placed successfully:', response);
         for(let i=0;i<bookIds.length;i++){
          this.bookService.deleteBookFromCart(bookIds[i]||0).subscribe(res=>console.log(res)
          )
         }
          this.router.navigate(['/dashboard/orders']);


        }, error => {
          console.error('Error placing order:', error);
        });
      } else {
        console.error('Invalid addressId:', addressId);
      }
    } else {
      // Handle authentication/token issues
    }
  }
  

  removeFromCart(book: BookObj) {
    this.cartItems = this.cartItems.filter(item => item.bookId !== book.bookId);
    this.dataService.removeFromCart(book);
    if (book && book.bookId !== undefined) {
      this.bookService.deleteBookFromCart(book.bookId).subscribe(() => {
        // Book removed successfully, update UI or perform any other actions
      }, error => {
        console.error('Error removing book from cart:', error);
      });
    }
  }
  increaseCount(book: BookObj) {
    if (book && book.quantity !== undefined) {
      book.quantity++; // Update local quantity
      if (localStorage.getItem('authToken') != null) {
        // Auth token is present, update quantity on the server
        this.dataService.updateCartItemQuantity(book, this.count);
        this.bookService.updateBookQuantity(book, book.quantity).subscribe(() => {
          // Update UI or perform any other actions after successful update on server
        }, error => {
          console.error('Error updating quantity on server:', error);
        });
      }
    }
  }
  
  decreaseCount(book: BookObj) {
    if (book && book.quantity !== undefined && book.quantity > 1) {
      book.quantity--; // Update local quantity
      if (localStorage.getItem('authToken') != null) {
        // Auth token is present, update quantity on the server
        this.dataService.updateCartItemQuantity(book, this.count);
        this.bookService.updateBookQuantity(book, book.quantity).subscribe(() => {
          // Update UI or perform any other actions after successful update on server
        }, error => {
          console.error('Error updating quantity on server:', error);
        });
      }
    }
  }
  

  handlePlaceOrder() {
    if (localStorage.getItem('authToken') != null) {
      // Logic for handling order placement when token is present
      
    } else {
      // Navigate to login/signup page
      this.router.navigate(['/dashboard/books']).then(() => {
        // Open dialog after navigation
        const dialogRef = this.dialog.open(LoginSignupComponent, {data:{value:'placeOrder',cart:this.cartItems} });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
      });
    }
  }
}
