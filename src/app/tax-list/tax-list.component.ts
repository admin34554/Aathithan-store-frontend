import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tax, TaxService } from '../services/tax.service';
import { Router, RouterModule } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tax-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './tax-list.component.html',
  styleUrls: ['./tax-list.component.css']
})

export class TaxListComponent implements OnInit {

  tax: Tax[] = [];
  filteredTax: Tax[] = [];
  searchText: string = '';

  currentPage = 1;
  pageSize = 10;
      selectedIndex = 0;


  constructor(private taxService: TaxService, private translate: TranslateService, private router: Router) {

              const lang = localStorage.getItem('lang') || 'en';

  this.translate.setDefaultLang('en');
  this.translate.use(lang);
  }

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
      t.hsnDescription?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      t.hsnCode?.toLowerCase().includes(this.searchText.toLowerCase())
    );

    this.currentPage = 1;
    this.selectedIndex = 0;
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
    
      const taxes = this.paginatedTax;
    
      if (!taxes || taxes.length === 0) {
        return;
      }
    
      // DOWN ARROW
      if (event.key === 'ArrowDown') {
    
        event.preventDefault();
    
        if (this.selectedIndex < taxes.length - 1) {
          this.selectedIndex++;
        } 
        else if (this.currentPage < this.totalPages) {
          this.currentPage++;
          this.selectedIndex = 0;
        }
    
        return;
      }

          // + = ADD NEW
if (event.key === '+') {

  event.preventDefault();

  this.router.navigate(['/tax']);

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
          if (this.selectedIndex >= this.paginatedTax.length) {
            this.selectedIndex = this.paginatedTax.length - 1;
          }
        }
    
        return;
      }
    
      // E = EDIT
      if (event.key.toLowerCase() === 'e') {
    
        event.preventDefault();
    
        const tax = taxes[this.selectedIndex];
    
        if (tax?.id) {
          this.editTax(tax.id);
        }
    
        return;
      }
    
      // V = VIEW
      if (event.key.toLowerCase() === 'v') {
    
        event.preventDefault();
    
        const tax = taxes[this.selectedIndex];
    
        if (tax?.id) {
          this.viewTax(tax.id);
        }
    
        return;
      }
    
      // ENTER = VIEW
      if (event.key === 'Enter') {
    
        event.preventDefault();
    
        const tax = taxes[this.selectedIndex];
    
        if (tax?.id) {
          this.viewTax(tax.id);
        }
    
        return;
      }
    }
    
    get totalPages(): number {
      return Math.ceil(this.filteredTax.length / this.pageSize);
    }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  viewTax(id:number){
    this.router.navigate(['/tax/view', id]);
  }

  editTax(id:number){
    this.router.navigate(['/tax/edit', id]);
  }

}