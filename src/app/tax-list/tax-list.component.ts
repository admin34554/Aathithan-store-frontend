import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tax, TaxService } from '../services/tax.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tax-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tax-list.component.html',
  styleUrls: ['./tax-list.component.css']
})

export class TaxListComponent implements OnInit {

  tax: Tax[] = [];
  filteredTax: Tax[] = [];
  searchText: string = '';

  currentPage = 1;
  pageSize = 5;

  constructor(private taxService: TaxService) {}

  ngOnInit(): void {
    this.loadTax();
  }

  loadTax() {
    this.taxService.getTaxes().subscribe(data => {
      this.tax = data;
      this.filteredTax = data;
    });
  }

  searchTax() {
    this.filteredTax = this.tax.filter(t =>
      t.name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      t.taxCode?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get paginatedTax() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredTax.slice(start, start + this.pageSize);
  }

  nextPage() {
    if ((this.currentPage * this.pageSize) < this.filteredTax.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

}