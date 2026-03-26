import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

export interface CreditBill {
  id?: number;
  name: string;
  brokerName: string;
  lorry: number;
  broker: number;
  billNo: string;
  billDate: Date;
  productCode: string;
  itemName: string;
  taxType: string;
  rate: number;
  quantity: number;
  tax: string;
  total: number;
  brNo: string;
  surCharge: string;
  remarks: string;
}

@Injectable({
  providedIn: 'root'
})
export class CreditBillService {

  private baseUrl = `${environment.apiUrl}/api/v1/credit-bill`;

  constructor(private http: HttpClient) {}

  // GET LIST
  getCreditBill(): Observable<CreditBill[]> {
    return this.http.get<CreditBill[]>(`${this.baseUrl}/list-view`);
  }

  // SAVE CREDIT BILL
  addCreditBill(creditBill: CreditBill): Observable<CreditBill> {
    return this.http.post<CreditBill>(this.baseUrl, creditBill);
  }

  // UPDATE
  updateCreditBill(id: number, creditBill: CreditBill): Observable<CreditBill> {
    return this.http.put<CreditBill>(`${this.baseUrl}/${id}`, creditBill);
  }

  // DELETE
  deleteCreditBill(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}