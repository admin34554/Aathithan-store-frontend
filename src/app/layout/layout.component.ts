import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SupplierService } from '../services/supplier.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  imports: [RouterOutlet, FormsModule, CommonModule, RouterModule]
})
export class LayoutComponent {
scrollToActive() {
  setTimeout(() => {
    const el = document.querySelector('.result-item.active');
    el?.scrollIntoView({ block: 'nearest' });
  });
}onSearch() {

  const value = this.searchText.toLowerCase();

  this.results = this.searchItems.filter(item =>
    item.name.toLowerCase().includes(value)
  );

  this.selectedIndex = -1; // reset selection on new search

}
selectResult(item: any) {

  if (item.api === 'master') {

    this.router.navigate([item.route]);

  }

  if (item.api === 'list-view') {

    this.supplierService.getSuppliers().subscribe(res => {

      console.log(res);
      this.router.navigate([item.route]);

    });

  }

  this.results = [];
  this.searchText = '';

}

  searchText = '';
  showDropdown = false;
  isCollapsed = false;
  openMenu = '';

  menuItems = [

    { name: 'Supplier Master', route: '/supplier' },
    { name: 'Customer Master', route: '/customer' },
    { name: 'Company Master', route: '/company' },
    { name: 'Product Master', route: '/product' },
    { name: 'Lorry Master', route: '/lorry' },
    { name: 'Broker Master', route: '/broker' },
    { name: 'Tax Master', route: '/tax' },
    { name: 'Accounts Master', route: '/accounts-master' },
    { name: 'Cash Bill', route: '/cash-bill' },
    { name: 'Credit Bill', route: '/credit-bill' },
    { name: 'Purchase Bill', route: '/purchase-bill' },
    { name: 'Day Book', route: '/day-book' },
    { name: 'Home', route: '/'}

  ];

  filteredMenu: any[] = [];

constructor(
  private router: Router,
  private supplierService: SupplierService
) {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleMenu(menu: string) {
    this.openMenu = this.openMenu === menu ? '' : menu;
  }

  filterMenu() {

    const value = this.searchText.toLowerCase();

    this.filteredMenu = this.menuItems.filter(menu =>
      menu.name.toLowerCase().includes(value)
    );

  }

 

activeMenu: string = '';

selectMenu(menu: string) {

  if (this.activeMenu === menu) {
    this.activeMenu = '';     // collapse if clicked again
  } else {
    this.activeMenu = menu;   // open selected menu
  }

}

navigate(route: string) {
  this.router.navigate([route]);
  this.activeMenu = ''; // collapse menu after navigation
}

handleKeyDown(event: KeyboardEvent) {

  if (this.results.length === 0) return;

  if (event.key === 'ArrowDown') {
    event.preventDefault();

    this.selectedIndex =
      this.selectedIndex < this.results.length - 1
        ? this.selectedIndex + 1
        : 0;

    this.scrollToActive();
  }

  else if (event.key === 'ArrowUp') {
    event.preventDefault();

    this.selectedIndex =
      this.selectedIndex > 0
        ? this.selectedIndex - 1
        : this.results.length - 1;

    this.scrollToActive();
  }

  else if (event.key === 'Enter') {
    if (this.selectedIndex >= 0) {
      this.selectResult(this.results[this.selectedIndex]);
    }
  }
}

selectedIndex: number = -1;

results: any[] = [];

searchItems = [
  {
    name: 'Supplier Master',
    route: '/supplier',
    api: 'master'
  },
  {
    name: 'Supplier List',
    route: '/supplier-list',
    api: 'list-view'
  },
  {
    name: 'Customer Master',
    route: '/customer',
    api: 'master'
  },
  {
    name: 'Customer List',
    route: '/customer-list',
    api: 'list-view'
  },
  {
    name: 'Lorry Master',
    route: '/lorry',
    api: 'master'
  },
  {
    name: 'Lorry List',
    route: '/lorry-list',
    api: 'list-view'
  },
  {
    name: 'Broker Master',
    route: '/broker',
    api: 'master'
  },
  {
    name: 'Broker List',
    route: '/broker-list',
    api: 'list-view'
  },
  {
    name: 'Tax Master',
    route: '/tax',
    api: 'master'
  },
  {
    name: 'Tax List',
    route: '/tax-list',
    api: 'list-view'
  },
  {
    name: 'Product Master',
    route: '/product',
    api: 'master'
  },
  {
    name: 'Product List',
    route: '/product-list',
    api: 'list-view'
  },
  { name: 'Accounts Master',
    route: '/accounts-master',
    api: 'master'
  },
  { name: 'Cash Bill',
    route: '/cash-bill',
    api: 'master'
  },
  { name: 'Credit Bill',
    route: '/credit-bill',
    api: 'master'
  },
  { name: 'Purchase Bill',
    route: '/purchase-bill',
    api: 'master'
  },
  { name: 'Day Book',
    route: '/day-book',
    api: 'master'
  }
];

}