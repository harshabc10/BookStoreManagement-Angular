import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private httpService:HttpService) { }

  getAllBooksCall():Observable<any> {
    return this.httpService.getBooks();
  }
}
