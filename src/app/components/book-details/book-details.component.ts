import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from 'src/app/services/book-service/book.service';
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
  

  constructor(private bookService: BookService, private route: ActivatedRoute) {}

  ngOnInit(): void {

    
    this.bookService.currentBookList.subscribe(res1 => {
      this.route.params.subscribe(res2=>
        {
          this.selectedBook=res1.filter(e=>e.bookId==res2['bookId'])[0]
    })
      // this.selectedBook = res;
    });
    // this.bookService.currentstate.subscribe(res=>console.log(res));
    
  }

  addToBag() {
    this.addedToBag = true;
    this.bookService.addToCart(this.selectedBook);
  }

  increaseCount() {
    this.count++;
  }

  decreaseCount() {
    if (this.count > 1) {
      this.count--;
    }
  }
}
