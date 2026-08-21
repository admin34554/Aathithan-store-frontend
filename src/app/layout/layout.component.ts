import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SupplierService } from '../services/supplier.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CompanyService, Company } from '../services/company.service';
import { CompanyContextService } from '../services/company-context.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  imports: [RouterOutlet, FormsModule, CommonModule, RouterModule, TranslateModule]
})
export class LayoutComponent {
  @ViewChild('searchBox') searchBox!: ElementRef;
scrollToActive() {
  setTimeout(() => {
    const el = document.querySelector('.result-item.active');
    el?.scrollIntoView({ block: 'nearest' });
  });
}

  showSettings = false;
  showCompanyPopup = false;

companies: Company[] = [];

onSearch() {
  const value = this.searchText.toLowerCase();

  this.results = this.searchItems.filter(item =>
    item.name.toLowerCase().includes(value)
  );

  this.selectedIndex = -1;
}
selectResult(item: any) {
  if (item.api === 'master') {
    this.router.navigate([item.route]);
  }

  if (item.api === 'list-view') {
    this.supplierService.getSuppliers().subscribe(() => {
      this.router.navigate([item.route]);
    });
  }

  this.results = [];
  this.searchText = '';
  this.selectedIndex = -1;
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
    {name: 'Product Type Master', route: '/product-type' },
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
  private supplierService: SupplierService,
  private eRef: ElementRef,
  private translate: TranslateService,
  private companyService: CompanyService,
  private companyContextService: CompanyContextService
) {  
  const lang = localStorage.getItem('lang') || 'en';

  this.translate.setDefaultLang('en');
  this.translate.use(lang);
  
  }

   toggleSettings() {
    this.showSettings = !this.showSettings;
  }

toggleCompanyPopup() {

  this.showCompanyPopup = true;

  this.selectedCompanyId =
    Number(localStorage.getItem('companyId'));

  this.companyService.getCompany().subscribe(data => {

    this.companies = data;

  });

}


logout() {

  localStorage.clear();

  this.showSettings = false;

  this.router.navigate(['/login']);

}

  changeLanguage(lang: string) {

  this.translate.use(lang);

  localStorage.setItem('lang', lang);

  this.showSettings = false;
}
@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent) {

  const target = event.target as HTMLElement;

  if (!target.closest('.settings-container')) {
    this.showSettings = false;
  }
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

selectedCompanyId!: number;
saveSelectedCompany() {

  const company = this.companies.find(
      c => c.id === this.selectedCompanyId
  );

if (company && company.id != null) {

  this.selectedCompanyName = company.name;

  localStorage.setItem('companyId', company.id.toString());

  localStorage.setItem('companyName', company.name);

  this.companyContextService.setCompany(company);
}

  this.showCompanyPopup = false;
}

selectedCompanyName = '';

ngOnInit() {

  this.selectedCompanyName =
    localStorage.getItem('companyName') || 'Select Company';

  this.selectedCompanyId =
    Number(localStorage.getItem('companyId'));

  if (localStorage.getItem('token')) {
    this.router.navigate(['/']);
  }

}

@HostListener('document:click', ['$event'])
handleClickOutside(event: MouseEvent) {
  if (this.searchBox && !this.searchBox.nativeElement.contains(event.target)) {
    this.results = [];
    this.selectedIndex = -1;
  }
}

@HostListener('document:keydown.escape')
handleEscape() {
  this.results = [];
  this.selectedIndex = -1;
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

isSidebarCollapsed = true;

toggleSidebar() {
  this.isSidebarCollapsed = !this.isSidebarCollapsed;
}

selectedIndex: number = -1;

results: any[] = [];

searchItems = [
  // {
  //   name: 'Supplier Master',
  //   route: '/supplier',
  //   api: 'master'
  // },
  {
    name: 'Supplier Master',
    route: '/supplier-list',
    api: 'list-view'
  },
  // {
  //   name: 'Customer Master',
  //   route: '/customer',
  //   api: 'master'
  // },
  {
    name: 'Customer Master',
    route: '/customer-list',
    api: 'list-view'
  },
  // {
  //   name: 'Lorry Master',
  //   route: '/lorry',
  //   api: 'master'
  // },
  {
    name: 'Lorry Master',
    route: '/lorry-list',
    api: 'list-view'
  },
  // {
  //   name: 'Broker Master',
  //   route: '/broker',
  //   api: 'master'
  // },
  {
    name: 'Broker Master',
    route: '/broker-list',
    api: 'list-view'
  },
  // {
  //   name: 'Tax Master',
  //   route: '/tax',
  //   api: 'master'
  // },
  {
    name: 'Tax Master',
    route: '/tax-list',
    api: 'list-view'
  },
  // {
  //   name: 'Product Master',
  //   route: '/product',
  //   api: 'master'
  // },
  {
    name: 'Product Master',
    route: '/product-list',
    api: 'list-view'
  },
  { name: 'Product Type Master',
    route: '/product-type',
    api: 'master'
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
  },
  {
    name: 'Company Master',
    route: '/company',
    api: 'master'
  },
  {
    name: 'Stock Master',
    route: '/stock-master',
    api: 'master'
  }
];

}