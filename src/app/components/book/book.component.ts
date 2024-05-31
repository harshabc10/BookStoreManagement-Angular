import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscriber, Subscription } from 'rxjs';
import { BookService } from 'src/app/services/book-service/book.service';
import { DataService } from 'src/app/services/data-service/data.service';
import { BookObj } from 'src/assets/booksInterface';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {
  @Input() BookObjList !:BookObj[]
  searchString:string=''
  subscription!:Subscription
  constructor(private bookService: BookService, private router:Router,private dataService: DataService) { }

  ngOnInit(): void {
    this.subscription=this.dataService.currSearchString.subscribe(res=>this.searchString)
    
  }

  handleBook(book:BookObj){
    // this.bookService.changeState(book)
     this.router.navigate(["/dashboard/bookdetails", book.bookId])

  }
}
