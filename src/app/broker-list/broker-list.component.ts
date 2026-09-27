import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Broker, BrokerService } from '../services/broker.service';
import { Router, RouterModule } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-broker-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './broker-list.component.html',
  styleUrls: ['./broker-list.component.css']
})

export class BrokerListComponent implements OnInit {

  broker: Broker[] = [];
  filteredBroker: Broker[] = [];
  searchText: string = '';

  currentPage = 1;
  pageSize = 5;
  selectedIndex = 0;

  constructor(private brokerService: BrokerService, 
    private translate: TranslateService,
    private router: Router) {

  const lang = localStorage.getItem('lang') || 'en';

  this.translate.setDefaultLang('en');
  this.translate.use(lang);
    
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
  
    const customers = this.paginatedBroker;
  
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
        if (this.selectedIndex >= this.paginatedBroker.length) {
          this.selectedIndex = this.paginatedBroker.length - 1;
        }
      }
  
      return;
    }
  

        // + = ADD NEW
if (event.key === '+') {

  event.preventDefault();

  this.router.navigate(['/broker']);

  return;
}


    // E = EDIT
    if (event.key.toLowerCase() === 'e') {
  
      event.preventDefault();
  
      const customer = customers[this.selectedIndex];
  
      if (customer?.id) {
        this.editBroker(customer.id);
      }
  
      return;
    }
  
    // V = VIEW
    if (event.key.toLowerCase() === 'v') {
  
      event.preventDefault();
  
      const customer = customers[this.selectedIndex];
  
      if (customer?.id) {
        this.viewBroker(customer.id);
      }
  
      return;
    }
  
    // ENTER = VIEW
    if (event.key === 'Enter') {
  
      event.preventDefault();
  
      const customer = customers[this.selectedIndex];
  
      if (customer?.id) {
        this.viewBroker(customer.id);
      }
  
      return;
    }
  }

  ngOnInit(): void {
    this.loadBroker();
  }

  loadBroker() {
    this.brokerService.getBroker().subscribe(data => {
      this.broker = data;
      this.filteredBroker = data;
    });
  }

    viewBroker(id:number){
    this.router.navigate(['/broker/view', id]);
  }

  editBroker(id:number){
    this.router.navigate(['/broker/edit', id]);
  }

  searchBroker() {
    this.filteredBroker = this.broker.filter(b =>
      b.brokerName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      b.code?.toString().includes(this.searchText)
    );

    this.currentPage = 1;
    this.selectedIndex = 0;
  }

  get paginatedBroker() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredBroker.slice(start, start + this.pageSize);
  }

  nextPage() {
    if ((this.currentPage * this.pageSize) < this.filteredBroker.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  get totalPages(): number {
  return Math.ceil(this.filteredBroker.length / this.pageSize);
}


}