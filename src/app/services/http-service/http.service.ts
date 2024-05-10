import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';

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

  getCartDetails(token: string): Observable<any> {
    return this.http.get<any>('https://localhost:7209/api/Cart/GetCartBooks', {headers:this.authHeader});
  }

  loginApi(email:string,password:string): Observable<any>{
    // https://localhost:7004/api/User/Login?Email=pdshashank8%40gmail.com&password=Shashank%4030
    return this.http.post(`https://localhost:7209/api/User/Login?Email=${encodeURI(email) }&password=${encodeURI(password)}`,{})
  }
  signUpApi(requestBody: any): Observable<any> {
    return this.http.post('https://localhost:7209/api/User', requestBody, {});
  }

}
