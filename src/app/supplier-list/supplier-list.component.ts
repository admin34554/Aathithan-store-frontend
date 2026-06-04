import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Supplier, SupplierService } from '../services/supplier.service';
import { RouterModule } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css']
})

export class SupplierListComponent implements OnInit {

  supplier: Supplier[] = [];
  filteredSupplier: Supplier[] = [];
  searchText: string = '';

  currentPage = 1;
  pageSize = 5;

  constructor(private supplierService: SupplierService, private translate: TranslateService) {

        const lang = localStorage.getItem('lang') || 'en';

  this.translate.setDefaultLang('en');
  this.translate.use(lang);
  }

  ngOnInit(): void {
    this.loadSupplier();
  }

  loadSupplier() {
    this.supplierService.getSuppliers().subscribe(data => {
      this.supplier = data;
      this.filteredSupplier = data;
    });
  }

  searchSupplier() {
    this.filteredSupplier = this.supplier.filter(s =>
      s.contact?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      s.type?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get paginatedSupplier() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredSupplier.slice(start, start + this.pageSize);
  }

  nextPage() {
    if ((this.currentPage * this.pageSize) < this.filteredSupplier.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

}