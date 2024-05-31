import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/services/book-service/book.service';
import { DataService } from 'src/app/services/data-service/data.service';
import { BookObj } from 'src/assets/booksInterface';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DROP_DOWN, LOCATION_ICON } from 'src/assets/svg-icons';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginSignupComponent } from '../login-signup/login-signup.component';

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
  selectedAddressId: number | null = null;
  placeOrder:boolean=false

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

  ngOnInit(): void {
    this.authToken = localStorage.getItem('authToken'); // Set authToken from localStorage

    this.dataService.getCartItems().subscribe(cartItems => {
      this.cartItems = cartItems;
    });

    this.dataService.getCartItemCount().subscribe(count => {
      this.count = count;
    });

    this.dataService.currAddressId.subscribe(addressId => {
      this.selectedAddressId = addressId;
    });
  }

  toggleAddressDetails() {
    if (this.authToken) {
      this.showAddressDetails = !this.showAddressDetails;
    }
  }

  toggleOrderSummary() {
    if (this.authToken) {
      this.showOrderSummary = !this.showOrderSummary;
    }
  }

  onAddressSelected(addressId: number) {
    this.selectedAddressId = addressId;
  }

  handleCheckout() {
    if (this.authToken && this.selectedAddressId !== null) {
      const order = {
        addressId: this.selectedAddressId,
        bookIds: this.cartItems.map(item => item.bookId)
      };

      this.bookService.addOrder(order, this.authToken).subscribe(response => {
        console.log('Order placed successfully:', response);
        for (const item of this.cartItems) {
          this.bookService.deleteBookFromCart(item.bookId || 0).subscribe(() => {
            // Handle book deletion from cart after order is placed
          });
        }
        this.router.navigate(['/dashboard/orders']);
      }, error => {
        console.error('Error placing order:', error);
      });
    } else {
      // Handle authentication/token issues or invalid addressId
    }
  }

  removeFromCart(book: BookObj) {
    this.cartItems = this.cartItems.filter(item => item.bookId !== book.bookId);
    this.dataService.removeFromCart(book);
    if (book.bookId !== undefined) {
      this.bookService.deleteBookFromCart(book.bookId).subscribe(() => {
        // Book removed successfully
      }, error => {
        console.error('Error removing book from cart:', error);
      });
    }
  }

  increaseCount(book: BookObj) {
    if (book.quantity !== undefined) {
      book.quantity++;
      this.updateBookQuantity(book);
    }
  }

  decreaseCount(book: BookObj) {
    if (book.quantity !== undefined && book.quantity > 1) {
      book.quantity--;
      this.updateBookQuantity(book);
    }
  }

  updateBookQuantity(book: BookObj) {
    if (book.bookId !== undefined && book.quantity !== undefined) {
      this.dataService.updateCartItemQuantity(book, book.quantity);
      if (this.authToken) {
        this.bookService.updateBookQuantity(book, book.quantity).subscribe(() => {
          // Update successful
        }, error => {
          console.error('Error updating quantity:', error);
        });
      }
    }
  }

  handlePlaceOrder() {
    if (this.authToken) {
      this.showAddressDetails=!this.showAddressDetails;
      this.showOrderSummary=!this.showOrderSummary
      this.placeOrder=!this.placeOrder
    } else {
      this.router.navigate(['/dashboard/books']).then(() => {
        const dialogRef = this.dialog.open(LoginSignupComponent, { data: { value: 'placeOrder', cart: this.cartItems } });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
      });
    }
  }
}
