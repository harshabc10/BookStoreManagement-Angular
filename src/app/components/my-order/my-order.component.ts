import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/services/book-service/book.service';
import { DataService } from 'src/app/services/data-service/data.service';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.scss']
})
export class MyOrderComponent implements OnInit {

  orders: any[] = [];

  constructor(private bookService: BookService, private dataService: DataService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      this.bookService.getAllOrders(authToken).subscribe(
        (response) => {
          this.orders = response
          this.cdr.detectChanges();  // Trigger change detection
        },
        (error) => {
          console.error('Error fetching orders:', error);
        }
      );
    } else {
      console.log('Auth token not present. Loading orders from local data.');
      this.dataService.currOrders.subscribe((orders) => {
        this.orders = [...orders];
        this.cdr.detectChanges();  // Trigger change detection
      });
    }
  }

}
