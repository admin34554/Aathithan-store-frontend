import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Lorry {
  id?: number;
  code: string;
  name: string;
  phoneNumber: string;
  mobileNumber: string;
  contactPerson: string;
  address: string;
  areaCovering: string;
  routeCovering: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LorryService {

  private baseUrl = 'http://localhost:9090/api/v1/lorry-master';

  constructor(private http: HttpClient) {}

  // GET LIST
  getLorry(): Observable<Lorry[]> {
    return this.http.get<Lorry[]>(`${this.baseUrl}/list-view`);
  }

  // SAVE LORRY
  addLorry(lorry: Lorry): Observable<Lorry> {
    return this.http.post<Lorry>(this.baseUrl, lorry);
  }

  // UPDATE
  updateLorry(id: number, lorry: Lorry): Observable<Lorry> {
    return this.http.put<Lorry>(`${this.baseUrl}/${id}`, lorry);
  }

  // DELETE
  deleteLorry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}