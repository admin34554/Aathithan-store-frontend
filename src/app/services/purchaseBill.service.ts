import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

export interface PurchaseBill {
  id?: number;
  name: string;
  brokerId: number;
  taxType: string;
  purchaseType: string;
  poNo: string;
  purchaseBillDate: Date;
  custBillDate: Date;
  productCode: string;
  itemName: string;
  pRate: number
  rate: number;
  balanceQuantity: number;
  quantity: number;
  brComm: number;
  brTotal: number;
  remarks: string;
}

@Injectable({
  providedIn: 'root'
})
export class PurchaseBillService {

  private baseUrl = `${environment.apiUrl}/api/v1/purchase-bill`;

  constructor(private http: HttpClient) {}

  // GET LIST
  getPurchaseBill(): Observable<PurchaseBill[]> {
    return this.http.get<PurchaseBill[]>(`${this.baseUrl}/list-view`);
  }

  // SAVE CASH BILL
  addPurchaseBill(purchaseBill: PurchaseBill): Observable<PurchaseBill> {
    return this.http.post<PurchaseBill>(this.baseUrl, purchaseBill);
  }

  // UPDATE
  updatePurchaseBill(id: number, purchaseBill: PurchaseBill): Observable<PurchaseBill> {
    return this.http.put<PurchaseBill>(`${this.baseUrl}/${id}`, purchaseBill);
  }

  // DELETE
  deletePurchaseBill(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}