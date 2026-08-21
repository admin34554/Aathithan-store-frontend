import { Component, OnInit } from '@angular/core';
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

}