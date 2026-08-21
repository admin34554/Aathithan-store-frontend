import { Injectable } from '@angular/core';

import {
    HttpClient
} from '@angular/common/http';

import {
    Observable
} from 'rxjs';

import {
    environment
} from '../../environments/environment';


export interface Stock {

    id?: number;

    itemName: string;

    hsnCode: string;

    mrp: number;

    msp: number;

    quantity: number;

    active: boolean;

}


@Injectable({
    providedIn: 'root'
})
export class StockMasterService {

    private baseUrl =
        `${environment.apiUrl}/api/v1/stock-master`;


    constructor(
        private http: HttpClient
    ) {}


    getStock(): Observable<Stock[]> {
        return this.http.get<Stock[]>(`${this.baseUrl}/list-view`);

    }


    getStockById(id: number): Observable<Stock> {
        return this.http.get<Stock>(
            `${this.baseUrl}/${id}`
        );

    }

    addStock(stock: Stock): Observable<Stock> {
        return this.http.post<Stock>(this.baseUrl,stock);
    }


    updateStock(id: number,stock: Stock): Observable<Stock> {
        return this.http.put<Stock>(`${this.baseUrl}/${id}`,stock);
    }

    deleteStock(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

}