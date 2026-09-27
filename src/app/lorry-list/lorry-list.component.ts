import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Lorry, LorryService } from '../services/lorry.service';
import { Router, RouterModule } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-lorry-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './lorry-list.component.html',
  styleUrls: ['./lorry-list.component.css']
})

export class LorryListComponent implements OnInit {

  lorry: Lorry[] = [];
  filteredLorry: Lorry[] = [];
  searchText: string = '';

  currentPage = 1;
  pageSize = 5;
  selectedIndex = 0;

  constructor(private lorryService: LorryService, private translate: TranslateService, private router: Router) {
        const lang = localStorage.getItem('lang') || 'en';

  this.translate.setDefaultLang('en');
  this.translate.use(lang);

  }

  ngOnInit(): void {
    this.loadLorry();
  }

  loadLorry() {
    this.lorryService.getLorry().subscribe(data => {
      this.lorry = data;
      this.filteredLorry = data;
    });
  }

  searchLorry() {
    this.filteredLorry = this.lorry.filter(l =>
      l.name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      l.code?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get paginatedLorry() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredLorry.slice(start, start + this.pageSize);
  }

  nextPage() {
    if ((this.currentPage * this.pageSize) < this.filteredLorry.length) {
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
  
    const customers = this.paginatedLorry;
  
    if (!customers || customers.length === 0) {
      return;
    }
  
    // DOWN ARROW
    if (event.key === 'ArrowDown') {
  
      event.preventDefault();
  
      if (this.selectedIndex < customers.length - 1) {
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
        if (this.selectedIndex >= this.paginatedLorry.length) {
          this.selectedIndex = this.paginatedLorry.length - 1;
        }
      }
  
      return;
    }

    // + = ADD NEW
if (event.key === '+') {

  event.preventDefault();

  this.router.navigate(['/lorry']);

  return;
}
  
    // E = EDIT
    if (event.key.toLowerCase() === 'e') {
  
      event.preventDefault();
  
      const customer = customers[this.selectedIndex];
  
      if (customer?.id) {
        this.editLorry(customer.id);
      }
  
      return;
    }
  
    // V = VIEW
    if (event.key.toLowerCase() === 'v') {
  
      event.preventDefault();
  
      const customer = customers[this.selectedIndex];
  
      if (customer?.id) {
        this.viewLorry(customer.id);
      }
  
      return;
    }
  
    // ENTER = VIEW
    if (event.key === 'Enter') {
  
      event.preventDefault();
  
      const customer = customers[this.selectedIndex];
  
      if (customer?.id) {
        this.viewLorry(customer.id);
      }
  
      return;
    }
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredLorry.length / this.pageSize);
  }



  viewLorry(id:number){
    this.router.navigate(['/lorry/view', id]);
  }

  editLorry(id:number){
    this.router.navigate(['/lorry/edit', id]);
  }
}