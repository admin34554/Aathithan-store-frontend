import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

export interface CashBill {
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
export class CashBillService {

  private baseUrl = `${environment.apiUrl}/api/v1/cash-bill`;

  constructor(private http: HttpClient) {}

  // GET LIST
  getCashBill(): Observable<CashBill[]> {
    return this.http.get<CashBill[]>(`${this.baseUrl}/list-view`);
  }

  // SAVE CASH BILL
  addCashBill(cashBill: CashBill): Observable<CashBill> {
    return this.http.post<CashBill>(this.baseUrl, cashBill);
  }

  // UPDATE
  updateCashBill(id: number, cashBill: CashBill): Observable<CashBill> {
    return this.http.put<CashBill>(`${this.baseUrl}/${id}`, cashBill);
  }

  // DELETE
  deleteCashBill(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}