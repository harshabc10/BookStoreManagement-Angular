import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) { }

  getBooks(): Observable<any> {
    return this.http.get<any>('https://localhost:7209/api/Book');
  }

  getCartDetails(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>('https://localhost:7209/api/Cart/GetCartBooks', { headers });
  }
}
