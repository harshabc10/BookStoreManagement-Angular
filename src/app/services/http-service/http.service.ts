import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { BookObj } from 'src/assets/booksInterface';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private authHeader = new HttpHeaders({
    //'Accept': "application/json",
    Authorization: `Bearer ${localStorage.getItem('authToken')}` || ""
  })
  constructor(private http: HttpClient) { }

  getBooks(): Observable<any> {
    return this.http.get<any>('https://localhost:7209/api/Book');
  }

  getCartDetails(token?:string): Observable<any> {
    if(token!=''&& token!=undefined)
      {
        return this.http.get<any>('https://localhost:7209/api/Cart/GetCartBooks', { headers:new  HttpHeaders({
          //'Accept': "application/json",
          Authorization: `Bearer ${token}` || ""
        })
       });

      }
    return this.http.get<any>('https://localhost:7209/api/Cart/GetCartBooks', { headers:this.authHeader });
  }

  addToCart(book: BookObj, quantity: number,token?:string): Observable<any> {
    const requestBody = { bookId: book.bookId, quantity };
    if(token!=''&& token!=undefined)
      {
        const req={bookId:book,quantity}
        return this.http.post<any>('https://localhost:7209/api/Cart/AddToCart',req, { headers:new  HttpHeaders({
          //'Accept': "application/json",
          Authorization: `Bearer ${token}` || ""
        })
       });

      }
    return this.http.post<any>('https://localhost:7209/api/Cart/AddToCart', requestBody, { headers: this.authHeader });
  }

  updateQuantity(book: BookObj, quantity: number,token?:string): Observable<any> {
    const requestBody = { bookId: book.bookId, quantity };
    if(token!=''&& token!=undefined)
      {
        const req={bookId:book,quantity}
        return this.http.put<any>('https://localhost:7209/api/Cart/UpdateQuantity',req, { headers:new  HttpHeaders({
          //'Accept': "application/json",
          Authorization: `Bearer ${token}` || ""
        })
       });

      }
    return this.http.put<any>('https://localhost:7209/api/Cart/UpdateQuantity', requestBody, { headers: this.authHeader });
  }

  deleteCart(bookId: number): Observable<any> {
    const url = `https://localhost:7209/api/Cart/DeleteCart?id=${bookId}`;
    return this.http.delete<any>(url, { headers: this.authHeader });
  }

  loginApi(email:string,password:string): Observable<any>{
    // https://localhost:7004/api/User/Login?Email=pdshashank8%40gmail.com&password=Shashank%4030
    return this.http.post(`https://localhost:7209/api/User/Login?Email=${encodeURI(email) }&password=${encodeURI(password)}`,{})
  }
  signUpApi(requestBody: any): Observable<any> {
    return this.http.post('https://localhost:7209/api/User', requestBody, {});
  }

}