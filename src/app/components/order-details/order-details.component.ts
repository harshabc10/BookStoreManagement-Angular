import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/services/book-service/book.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  orderDetail :any
  orders!: any;
  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    const token = localStorage.getItem('authToken')|| undefined;
      this.bookService.getAllOrders(token).subscribe(res=>this.orderDetail=res);
  }


}
