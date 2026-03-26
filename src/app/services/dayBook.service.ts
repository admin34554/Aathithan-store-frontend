import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

export interface DayBook {
  fromDate : Date;
  toDate : Date;
}

@Injectable({
  providedIn: 'root'
})
export class DayBookService {

  private baseUrl = `${environment.apiUrl}/api/v1/day-book`;

  constructor(private http: HttpClient) {}

  // GET LIST
  getDayBook(): Observable<DayBook[]> {
    return this.http.get<DayBook[]>(`${this.baseUrl}/list-view?fromDate`);
  }


}