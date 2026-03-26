import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

export interface Tax {
  id?: number;
  taxCode: string;
  name: string;
  salesTaxPerc: number;
  surChargePerc: number;
  groupName: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaxService {

  private baseUrl = `${environment.apiUrl}/api/v1/tax-master`;

  constructor(private http: HttpClient) {}

  // GET LIST
  getTaxes(): Observable<Tax[]> {
    return this.http.get<Tax[]>(`${this.baseUrl}/list-view`);
  }

  // SAVE TAX
  addTax(tax: Tax): Observable<Tax> {
    return this.http.post<Tax>(this.baseUrl, tax);
  }

  // UPDATE
  updateTax(id: number, tax: Tax): Observable<Tax> {
    return this.http.put<Tax>(`${this.baseUrl}/${id}`, tax);
  }

  // DELETE
  deleteTax(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}