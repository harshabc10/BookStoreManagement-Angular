import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/services/book-service/book.service';
import { BookObj } from 'src/assets/booksInterface';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.scss']
})
export class CartDetailsComponent implements OnInit {
  showAddressDetails: boolean = false;
  showOrderSummary: boolean = false;

  selectedBook!: BookObj;

  constructor(private bookService: BookService) { }
  toggleAddressDetails() {
    this.showAddressDetails = !this.showAddressDetails;
  }

  // Method to toggle Order Summary visibility
  toggleOrderSummary() {
    this.showOrderSummary = !this.showOrderSummary;
  }

  ngOnInit(): void {
    this.bookService.currentstate.subscribe(res => {
      this.selectedBook = res;
    });
    this.bookService.currentstate.subscribe(res=>console.log(res));
    
  }

}
