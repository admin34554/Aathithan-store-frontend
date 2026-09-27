import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Supplier, SupplierService } from '../services/supplier.service';
import { RouterModule } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

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

    selectedIndex = 0;
  currentPage = 1;
  pageSize = 5;

  constructor(private supplierService: SupplierService, private translate: TranslateService, private router: Router) {

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

  this.currentPage = 1;
  this.selectedIndex = 0;
}

  viewSupplier(id:number){
    this.router.navigate(['/supplier/view', id]);
  }

  editSupplier(id:number){
    this.router.navigate(['/supplier/edit', id]);
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


  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
  
    const target = event.target as HTMLElement;
  
    // Allow normal typing inside search/input fields
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT'
    ) {
      return;
    }
  
    const suppliers = this.paginatedSupplier;
  
    if (!suppliers || suppliers.length === 0) {
      return;
    }
  
    // DOWN ARROW
    if (event.key === 'ArrowDown') {
  
      event.preventDefault();
  
      if (this.selectedIndex < suppliers.length - 1) {
        this.selectedIndex++;
      } 
      else if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.selectedIndex = 0;
      }
  
      return;
    }
  
    // UP ARROW
    if (event.key === 'ArrowUp') {
  
      event.preventDefault();
  
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
      } 
      else if (this.currentPage > 1) {
        this.currentPage--;
        this.selectedIndex = this.pageSize - 1;
  
        // Make sure index is valid on the previous page
        if (this.selectedIndex >= this.paginatedSupplier.length) {
          this.selectedIndex = this.paginatedSupplier.length - 1;
        }
      }
  
      return;
    }

        // + = ADD NEW
if (event.key === '+') {

  event.preventDefault();

  this.router.navigate(['/supplier']);

  return;
}
  
    // E = EDIT
    if (event.key.toLowerCase() === 'e') {
  
      event.preventDefault();
  
      const supplier = suppliers[this.selectedIndex];
  
      if (supplier?.id) {
        this.editSupplier(supplier.id);
      }
  
      return;
    }
  
    // V = VIEW
    if (event.key.toLowerCase() === 'v') {
  
      event.preventDefault();
  
      const supplier = suppliers[this.selectedIndex];
  
      if (supplier?.id) {
        this.viewSupplier(supplier.id);
      }
  
      return;
    }
  
    // ENTER = VIEW
    if (event.key === 'Enter') {
  
      event.preventDefault();
  
      const supplier = suppliers[this.selectedIndex];
  
      if (supplier?.id) {
        this.viewSupplier(supplier.id);
      }
  
      return;
    }
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredSupplier.length / this.pageSize);
  }

}