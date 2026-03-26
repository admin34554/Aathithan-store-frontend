import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
    {
    path: 'customer',
    loadComponent: () =>
      import('./components/customer/customer.component')
        .then(m => m.CustomerComponent),
    },
    {
      path: 'customer-list',
      loadComponent: () =>
        import('./customer-list/customer-list.component')
          .then(m => m.CustomerListComponent)
    },
    {
      path: 'tax',
      loadComponent: () =>
        import('./tax/tax.component')
          .then(m => m.TaxComponent)
    },
    {
      path: 'tax-list',
      loadComponent: () =>
        import('./tax-list/tax-list.component')
          .then(m => m.TaxListComponent)
    },
    {
      path: 'lorry',
      loadComponent: () =>
        import('./lorry/lorry.component')
          .then(m => m.LorryComponent)
    },
    {
      path: 'lorry-list',
      loadComponent: () =>
        import('./lorry-list/lorry-list.component')
          .then(m => m.LorryListComponent)
    },
    {
      path: 'broker',
      loadComponent: () =>
        import('./broker/broker.component')
          .then(m => m.BrokerComponent)
    },
    {
      path: 'broker-list',
      loadComponent: () =>
        import('./broker-list/broker-list.component')
          .then(m => m.BrokerListComponent)
    },
    {
      path: 'supplier',
      loadComponent: () =>
        import('./supplier/supplier.component')
          .then(m => m.SupplierComponent)
    },
    {
      path: 'supplier-list',
      loadComponent: () =>
        import('./supplier-list/supplier-list.component')
          .then(m => m.SupplierListComponent)
    },
    {
      path: 'product',
      loadComponent: () =>
        import('./product/product.component')
          .then(m => m.ProductComponent)
    },
    {
      path: 'product-list',
      loadComponent: () =>
        import('./product-list/product-list.component')
          .then(m => m.ProductListComponent)
    },
    {
      path: 'cash-bill',
      loadComponent: () =>
        import('./cash-bill/cash-bill.component')
          .then(m => m.CashBillComponent)
    },
    {
      path: 'purchase-bill',
      loadComponent: () =>
        import('./purchase-bill/purchase-bill.component')
          .then(m => m.PurchaseBillComponent)
    },
    {
      path: 'day-book',
      loadComponent: () =>
        import('./day-book/day-book.component')
          .then(m => m.DayBookListComponent)
    },
    {
      path: 'credit-bill',
      loadComponent: () =>
        import('./credit-bill/credit-bill.component')
          .then(m => m.CreditBillComponent)
    },
    {
      path: 'layout',
      loadComponent: () =>
        import('./layout/layout.component')
          .then(m => m.LayoutComponent)
    }
    ]
  },
  { path: '', redirectTo: '/customer', pathMatch: 'full' }
];