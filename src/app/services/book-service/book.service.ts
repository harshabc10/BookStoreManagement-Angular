import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { BookObj } from 'src/assets/booksInterface';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  

  constructor(private httpService:HttpService) { }

  

  getAllBooksCall():Observable<any> {
    return this.httpService.getBooks();
  }

  getAllCartDetails(): Observable<any> {
    return this.httpService.getCartDetails();
  }

  addBookToCart(book: BookObj, quantity: number): Observable<any> {
    return this.httpService.addToCart(book, quantity);
  }

  updateBookQuantity(book: BookObj, quantity: number): Observable<any> {
    return this.httpService.updateQuantity(book, quantity);
  }
  deleteBookFromCart(bookId: number): Observable<any> {
    return this.httpService.deleteCart(bookId);
  }
  
}
