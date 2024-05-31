import { Component, OnInit } from '@angular/core';
import { ICON_REGISTRY_PROVIDER, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BookService } from 'src/app/services/book-service/book.service';
import { DataService } from 'src/app/services/data-service/data.service';
import { BookObj } from 'src/assets/booksInterface';
import { DROP_DOWN } from 'src/assets/svg-icons';

@Component({
  selector: 'app-books-container',
  templateUrl: './books-container.component.html',
  styleUrls: ['./books-container.component.scss']
})
export class BooksContainerComponent implements OnInit {
  booksList: BookObj[] = []; // Corrected variable name and initialization syntax
  constructor(private dataService: DataService,  iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer) { 
      iconRegistry.addSvgIconLiteral(
        'drop-down-icon',
        sanitizer.bypassSecurityTrustHtml(DROP_DOWN)
      );
  }

  ngOnInit(): void {
    // this.bookService.getAllBooksCall().subscribe(res => {
    //   console.log(res.data);
    //   this.booksList=[...res.data]
    this.dataService.currentBookList.subscribe(res=>this.booksList=res)
      //console.log(this.booksList+"fffffff");


      
    }
  
}