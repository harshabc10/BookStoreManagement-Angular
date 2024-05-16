import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BookService } from 'src/app/services/book-service/book.service';
import { DataService } from 'src/app/services/data-service/data.service';
import { BookObj } from 'src/assets/booksInterface';
import { map } from 'rxjs/operators';
import { count } from 'console';

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


  constructor(private dataService: DataService, private bookService: BookService) {}

  toggleAddressDetails() {
    this.showAddressDetails = !this.showAddressDetails;
  }

  toggleOrderSummary() {
    this.showOrderSummary = !this.showOrderSummary;
  }

  ngOnInit(): void {
    this.bookService.getAllCartDetails().pipe(
      map(response => response.data)
    ).subscribe((cartItems: (BookObj & { quantity: number })[]) => {
      cartItems.forEach(item => this.dataService.addToCart(item, item.quantity));
    });

    this.cartItems$ = this.dataService.getCartItems();
  }

  removeFromCart(book: BookObj) {
    if (book && book.bookId !== undefined) { // Assuming cartId is used to identify the book in the cart
      this.bookService.deleteBookFromCart(book.bookId).subscribe(() => {
        // Book removed successfully, update UI or perform any other actions
        this.dataService.removeFromCart(book);
      }, error => {
        // Handle error if API call fails
        console.error('Error removing book from cart:', error);
      });
    }
  }

  increaseCount(book: BookObj) {
    this.dataService.addToCart(book,1); // Increase quantity by 1
  }

  decreaseCount(book: BookObj) {
    if (book && book.quantity !== undefined && book.quantity > 1) {
      this.dataService.addToCart(book, -1); // Decrease quantity by 1
    }
  }
}

