import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BookService } from 'src/app/services/book-service/book.service';
import { DataService } from 'src/app/services/data-service/data.service';
import { BookObj } from 'src/assets/booksInterface';
import { map } from 'rxjs/operators';
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
  cartItems$!: Observable<(BookObj & { quantity: number })[]>;
  count: number = 1;

  constructor(
    private dataService: DataService,
    private bookService: BookService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private router: Router,
    private dialog: MatDialog
  ) {
    iconRegistry.addSvgIconLiteral("location-icon", sanitizer.bypassSecurityTrustHtml(LOCATION_ICON));
    iconRegistry.addSvgIconLiteral("drop-down-icon", sanitizer.bypassSecurityTrustHtml(DROP_DOWN));
  }

  toggleAddressDetails() {
    this.showAddressDetails = !this.showAddressDetails;
  }

  toggleOrderSummary() {
    this.showOrderSummary = !this.showOrderSummary;
  }

  ngOnInit(): void {
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
      // Auth token is present, fetch all cart details
      this.bookService.getAllCartDetails().pipe(
        map(response => response.data)
      ).subscribe((cartItems: (BookObj & { quantity: number })[]) => {
        this.dataService.setCartItems(cartItems);  // Directly set cart items
      });
    }

    // Always fetch cart items, whether auth token is present or not
    this.cartItems$ = this.dataService.getCartItems();
  }

  removeFromCart(book: BookObj) {
    this.dataService.removeFromCart(book);
    if (book && book.bookId !== undefined) { // Assuming cartId is used to identify the book in the cart
      this.bookService.deleteBookFromCart(book.bookId).subscribe(() => {
        // Book removed successfully, update UI or perform any other actions
      }, error => {
        // Handle error if API call fails
        console.error('Error removing book from cart:', error);
      });
    }
  }

  increaseCount(book: BookObj) {
    this.dataService.addToCart(book, 1); // Increase quantity by 1
  }

  decreaseCount(book: BookObj) {
    if (book && book.quantity !== undefined && book.quantity > 1) {
      this.dataService.addToCart(book, -1); // Decrease quantity by 1
    }
  }

  handlePlaceOrder(data: any, choice?: string) {
    if (localStorage.getItem('authToken') != null) {
      // Logic for handling order placement when token is present
    } else {
      // Navigate to login/signup page
      this.router.navigate(['/dashboard/books']).then(() => {
        // Open dialog after navigation
        const dialogRef = this.dialog.open(LoginSignupComponent, { width: '720px', height: '480px' });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
      });
    }
  }
}
