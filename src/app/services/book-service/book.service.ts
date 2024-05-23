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

  getAllCartDetails(token?:string): Observable<any> {
    return this.httpService.getCartDetails(token);
  }

  addBookToCart(book: BookObj, quantity: number,token?:string): Observable<any> {
    return this.httpService.addToCart(book, quantity,token);
  }

  updateBookQuantity(book: BookObj, quantity: number,token?:string): Observable<any> {
    return this.httpService.updateQuantity(book, quantity,token);
  }
  deleteBookFromCart(bookId: number): Observable<any> {
    return this.httpService.deleteCart(bookId);
  }
  addAllToWishlist(book: BookObj, token?: string): Observable<any>{
    return this.httpService.addToWishlist(book,token)
  }
  getAllBooksWishlist(token?: string): Observable<any>{
    return this.httpService.getAllWishlist(token)
  }
  getAllAddress(token?: string): Observable<any>{
    return this.httpService.getAddress(token)
  }
  deleteFromWishlist(bookId: number, token?: string): Observable<any> {
    return this.httpService.deleteWishlist(bookId, token);
  }
  editAddress(addressId: number, requestBody: any, token?: string): Observable<any> {
    return this.httpService.editAddressApiCall(addressId, requestBody, token);
  }
  addOrder(order: any, token?: string): Observable<any> {
    return this.httpService.addOrderApiCall(order, token);
  }

  // Method to get all orders
  getAllOrders(token?: string): Observable<any> {
    return this.httpService.getAllOrdersApiCall(token);
  }
}