import { Component, Input, OnInit } from '@angular/core';
import { BookObj } from 'src/assets/booksInterface';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {
  @Input() BookObjList !:BookObj[]
  constructor() { }

  ngOnInit(): void {
  }

}
