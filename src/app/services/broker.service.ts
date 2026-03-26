import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

export interface Broker {
  id?: number;
  code: number;
  brokerName: string;
  phoneNumber: number;
  mobileNumber: number;
  address: string;
  localComm: number;
  outComm: number;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BrokerService {

  private baseUrl = `${environment.apiUrl}/api/v1/broker-master`;

  constructor(private http: HttpClient) {}

  // GET LIST
  getBroker(): Observable<Broker[]> {
    return this.http.get<Broker[]>(`${this.baseUrl}/list-view`);
  }

  // SAVE BROKER
  addBroker(broker: Broker): Observable<Broker> {
    return this.http.post<Broker>(this.baseUrl, broker);
  }

  // UPDATE
  updateBroker(id: number, broker: Broker): Observable<Broker> {
    return this.http.put<Broker>(`${this.baseUrl}/${id}`, broker);
  }

  // DELETE
  deleteBroker(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  

}