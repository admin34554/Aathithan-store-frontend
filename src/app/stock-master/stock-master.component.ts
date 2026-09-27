import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import {
    StockMasterService,
    Stock
} from '../services/stock-master.service';

@Component({
    selector: 'app-stock-master',
    standalone: true,

    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        RouterModule
    ],

    templateUrl: './stock-master.component.html',
    styleUrl: './stock-master.component.css'
})
export class StockMasterComponent implements OnInit {

    stockList: Stock[] = [];

    filteredStock: Stock[] = [];

    searchText = '';

    currentPage = 1;
    selectedIndex = 0;


    pageSize = 10;

    loading = false;


    constructor(
        private translate: TranslateService,
        private stockMasterService: StockMasterService,
        private router: Router,
        private route: ActivatedRoute,
    ) {

        const lang = localStorage.getItem('lang') || 'en';

        this.translate.setDefaultLang('en');
        this.translate.use(lang);
    }


    ngOnInit(): void {

        this.loadStock();

    }


    // ============================
    // LOAD STOCK
    // ============================

    loadStock(): void {

        this.loading = true;

        this.stockMasterService.getStock().subscribe({

            next: (data: Stock[]) => {

                this.stockList = data || [];

                this.filteredStock = [...this.stockList];

                this.currentPage = 1;

                this.loading = false;

            },

            error: (error) => {

                console.error(
                    'Error loading stock:',
                    error
                );

                this.stockList = [];

                this.filteredStock = [];
                this.currentPage = 1;
                this.selectedIndex = 0;

                this.loading = false;

            }

        });

    }


    // ============================
    // SEARCH
    // ============================

searchStock(): void {

  const search = this.searchText
    .toLowerCase()
    .trim();

  if (!search) {

    this.filteredStock = [...this.stockList];

    this.currentPage = 1;
    this.selectedIndex = 0;

    return;
  }

  this.filteredStock = this.stockList.filter(stock =>
    stock.itemName?.toLowerCase().includes(search) ||
    stock.hsnCode?.toLowerCase().includes(search)
  );

  this.currentPage = 1;
  this.selectedIndex = 0;
}


    // ============================
    // PAGINATION
    // ============================

    get paginatedStock(): Stock[] {

        const start =
            (this.currentPage - 1)
            * this.pageSize;

        return this.filteredStock.slice(
            start,
            start + this.pageSize
        );

    }


    nextPage(): void {

        if (
            this.currentPage * this.pageSize
            < this.filteredStock.length
        ) {

            this.currentPage++;

        }

    }


    prevPage(): void {

        if (this.currentPage > 1) {

            this.currentPage--;

        }

    }


    // ============================
    // TOTAL QUANTITY
    // ============================

    getTotalQuantity(): number {

        return this.filteredStock.reduce(

            (total, stock) =>
                total + (Number(stock.quantity) || 0),

            0

        );

    }

@HostListener('document:keydown', ['$event'])
handleKeyboardEvent(event: KeyboardEvent): void {

  const target = event.target as HTMLElement;

  // Allow normal typing inside input fields,
  // BUT still allow ArrowUp / ArrowDown.
  const isInput =
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT';

  if (
    isInput &&
    event.key !== 'ArrowUp' &&
    event.key !== 'ArrowDown' &&
    event.key !== 'Enter' &&
    event.key !== 'Escape'
  ) {
    return;
  }

  const stocks = this.paginatedStock;

  if (!stocks || stocks.length === 0) {
    return;
  }

  // ============================
  // DOWN ARROW
  // ============================

  if (event.key === 'ArrowDown') {

    event.preventDefault();

    if (this.selectedIndex < stocks.length - 1) {

      this.selectedIndex++;

    } else if (this.currentPage < this.totalPages) {

      this.currentPage++;
      this.selectedIndex = 0;

    }

    return;
  }


  // ============================
  // UP ARROW
  // ============================

  if (event.key === 'ArrowUp') {

    event.preventDefault();

    if (this.selectedIndex > 0) {

      this.selectedIndex--;

    } else if (this.currentPage > 1) {

      this.currentPage--;

      // Go to last item of previous page
      this.selectedIndex = this.paginatedStock.length - 1;

    }

    return;
  }


  // ============================
  // + = ADD NEW
  // ============================

  if (event.key === '+') {

    event.preventDefault();

    this.router.navigate(['/stock']);

    return;
  }


  // ============================
  // E = EDIT
  // ============================

  if (event.key.toLowerCase() === 'e') {

    event.preventDefault();

    const stock = stocks[this.selectedIndex];

    if (stock?.id) {
      this.editStock(stock.id);
    }

    return;
  }


  // ============================
  // V = VIEW
  // ============================

  if (event.key.toLowerCase() === 'v') {

    event.preventDefault();

    const stock = stocks[this.selectedIndex];

    if (stock?.id) {
      this.viewStock(stock.id);
    }

    return;
  }


  // ============================
  // ENTER = VIEW
  // ============================

  if (event.key === 'Enter') {

    event.preventDefault();

    const stock = stocks[this.selectedIndex];

    if (stock?.id) {
      this.viewStock(stock.id);
    }

    return;
  }
}

      
      get totalPages(): number {
        return Math.ceil(this.filteredStock.length / this.pageSize);
      }



    printStock(): void {

        window.print();

    }

    viewStock(id: number): void {

    this.router.navigate(['/stock/view', id]);

    }

    editStock(id: number): void {

    this.router.navigate(['/stock/edit', id]);

    }

}