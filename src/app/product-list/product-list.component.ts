import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Product } from '../services/product.service';
import { RouterModule, Router } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchText: string = '';
  currentPage = 1;
  pageSize = 10;
  selectedIndex = 0;

  constructor(private productService: ProductService, private translate: TranslateService, private router: Router) {
     const lang = localStorage.getItem('lang') || 'en';

  this.translate.setDefaultLang('en');
  this.translate.use(lang);
}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.filteredProducts = data;
    });
  }

  searchProduct() {
    this.filteredProducts = this.products.filter(p =>
      p.productName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      p.description?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      p.productCode?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get paginatedProducts() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  nextPage() {
    if ((this.currentPage * this.pageSize) < this.filteredProducts.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

viewProduct(id: number) {
    this.router.navigate(['/product/view', id]);
}

editProduct(id: number) {
    this.router.navigate(['/product/edit', id]);
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
  
    const customers = this.paginatedProducts;
  
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
        if (this.selectedIndex >= this.paginatedProducts.length) {
          this.selectedIndex = this.paginatedProducts.length - 1;
        }
      }
  
      return;
    }

    // + = ADD NEW
if (event.key === '+') {

  event.preventDefault();

  this.router.navigate(['/product']);

  return;
}
  
    // E = EDIT
    if (event.key.toLowerCase() === 'e') {
  
      event.preventDefault();
  
      const customer = customers[this.selectedIndex];
  
      if (customer?.id) {
        this.editProduct(customer.id);
      }
  
      return;
    }
  
    // V = VIEW
    if (event.key.toLowerCase() === 'v') {
  
      event.preventDefault();
  
      const customer = customers[this.selectedIndex];
  
      if (customer?.id) {
        this.viewProduct(customer.id);
      }
  
      return;
    }
  
    // ENTER = VIEW
    if (event.key === 'Enter') {
  
      event.preventDefault();
  
      const customer = customers[this.selectedIndex];
  
      if (customer?.id) {
        this.viewProduct(customer.id);
      }
  
      return;
    }
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }

}