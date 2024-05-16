import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from 'src/app/services/book-service/book.service';
import { DataService } from 'src/app/services/data-service/data.service';
import { BookObj } from 'src/assets/booksInterface';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit {
  selectedBook!: BookObj;
  addedToBag: boolean = false;
  count: number = 1;

  constructor(private dataService: DataService, private route: ActivatedRoute, private bookService: BookService) {}

  ngOnInit(): void {
    this.dataService.currentBookList.subscribe(res1 => {
      this.route.params.subscribe(res2 => {
        this.selectedBook = res1.filter(e => e.bookId == res2['bookId'])[0];
        const cartItem = this.dataService.getCartItems().subscribe(cartItems => {
          const item = cartItems.find(item => item.bookId === this.selectedBook.bookId);
          if (item) {
            this.addedToBag = true;
            this.count = item.quantity;
          }
        });
      });
    });

    this.bookService.getAllCartDetails().subscribe(res => {
      const v = res.data;
      for (let i = 0; i < v.length; i++) {
        if (v[i].bookId === this.selectedBook.bookId) {
          this.addedToBag = true;
          this.count = v[i].quantity;
        }
      }
    });
  }

  addToBag() {
    this.addedToBag = true;
    this.dataService.addToCart(this.selectedBook, this.count);
    this.bookService.addBookToCart(this.selectedBook, this.count).subscribe(() => {
      console.log('Book added to cart successfully');
    });
  }

  increaseCount() {
    this.count++;
    if (this.addedToBag) {
      this.dataService.updateCartItemQuantity(this.selectedBook, this.count);
      this.bookService.updateBookQuantity(this.selectedBook, this.count).subscribe(() => {
        console.log('Book quantity updated successfully');
      });
    }
  }

  decreaseCount() {
    if (this.count > 1) {
      this.count--;
      if (this.addedToBag) {
        this.dataService.updateCartItemQuantity(this.selectedBook, this.count);
        this.bookService.updateBookQuantity(this.selectedBook, this.count).subscribe(() => {
          console.log('Book quantity updated successfully');
        });
      }
    }
  }
}
