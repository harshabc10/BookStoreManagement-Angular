import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BookService } from 'src/app/services/book-service/book.service';
import { HttpService } from 'src/app/services/http-service/http.service';
import { BookObj } from 'src/assets/booksInterface';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.scss']
})
export class CartDetailsComponent implements OnInit {
  showAddressDetails: boolean = false;
  showOrderSummary: boolean = false;
  selectedBook: BookObj[] = [];
  cartDetails$!: Observable<any>; // Using definite assignment assertion operator

  token: string | null = null; // Token fetched from local storage

  constructor(private bookService: BookService, private httpService: HttpService) {}

  toggleAddressDetails() {
    this.showAddressDetails = !this.showAddressDetails;
  }

  toggleOrderSummary() {
    this.showOrderSummary = !this.showOrderSummary;
  }

  ngOnInit(): void {
    this.selectedBook = this.bookService.getCartItems();
    // Fetch token from local storage
    this.token = localStorage.getItem('authToken');
    if (this.token) {
      // Call getAllCartDetails with the token
      this.cartDetails$ = this.bookService.getAllCartDetails();
    } else {
      console.error('Token not found in local storage.');
    }
  }

  removeFromCart(book: BookObj) {
    this.bookService.removeFromCart(book);
    this.selectedBook = this.bookService.getCartItems();
  }
}
