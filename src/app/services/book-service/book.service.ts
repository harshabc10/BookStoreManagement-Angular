import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { BookObj } from 'src/assets/booksInterface';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private booksList  =new BehaviorSubject<BookObj[]>([]);
  private bookList:BookObj[]=[]

  bookListState = new BehaviorSubject<BookObj[]>([]);
  currentBookList=this.booksList.asObservable();
  changeState(value:BookObj[])
  {
    this.booksList.next(value)
  }

  private searchString = new BehaviorSubject('');
  currSearchString=this.searchString.asObservable();

  private cartItems:BookObj[]=[]

  private cartItemCount = new BehaviorSubject<number>(0);

  constructor(private httpService:HttpService) { }

  getCartItemCount() {
    return this.cartItemCount.asObservable();
  }

  addToCart(book: BookObj) {
    this.cartItems.push(book);
    this.cartItemCount.next(this.cartItems.length);
  }

  removeFromCart(book: BookObj) {
    this.cartItems = this.cartItems.filter(item => item !== book);
 
  }
  getCartItems(): BookObj[] {
    return this.cartItems;
  }

  getAllBooksCall():Observable<any> {
    return this.httpService.getBooks();
  }

  getAllCartDetails(): Observable<any> {
    return this.httpService.getCartDetails();
  }

  updateSearchString(state:string){
    this.searchString.next(state)
  }

}
