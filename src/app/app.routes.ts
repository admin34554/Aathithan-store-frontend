import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [

    {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component')
        .then(m => m.LoginComponent)
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
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
      path: 'lorry-master',
      loadComponent: () =>
        import('./lorry/lorry.component')
          .then(m => m.LorryComponent)
    },
    {
      path: 'lorry-master/view/:id',
      loadComponent: () =>
        import('./lorry/lorry.component')
          .then(m => m.LorryComponent)
    },
    {
      path: 'lorry-master/edit/:id',
      loadComponent: () =>
        import('./lorry/lorry.component')
          .then(m => m.LorryComponent)
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
      path: 'product-type',
      loadComponent: () =>
        import('./product-type/product-type.component')
          .then(m => m.ProductTypeComponent)
    },
    {
      path: 'layout',
      loadComponent: () =>
        import('./layout/layout.component')
          .then(m => m.LayoutComponent)
    },
    {
      path: 'company',
      loadComponent: () =>
        import('./company-master/company-master.component')
          .then(m => m.CompanyMasterComponent)
    },
    {
      path: 'tax/:id',
      loadComponent: () =>
        import('./tax/tax.component')
          .then(m => m.TaxComponent)
    },
    {
      path: 'supplier/view/:id',
      loadComponent: () =>
        import('./supplier/supplier.component')
          .then(m => m.SupplierComponent)
    },
    {
      path: 'supplier/edit/:id',
      loadComponent: () =>
        import('./supplier/supplier.component')
          .then(m => m.SupplierComponent)
    },
    {
      path: 'customer/view/:id',
      loadComponent: () =>
      import('./components/customer/customer.component')
          .then(m => m.CustomerComponent)
    },
    {
      path: 'customer/edit/:id',
      loadComponent: () =>
        import('./components/customer/customer.component')
          .then(m => m.CustomerComponent)
    },
    {
      path: 'tax/view/:id',
      loadComponent: () =>
        import('./tax/tax.component')
          .then(m => m.TaxComponent)
    },
    {
      path: 'tax/edit/:id',
      loadComponent: () =>
        import('./tax/tax.component')
          .then(m => m.TaxComponent)
    },
    {
      path: 'product/view/:id',
      loadComponent: () =>
        import('./product/product.component')
          .then(m => m.ProductComponent)
    },
    {
      path: 'product/edit/:id',
      loadComponent: () =>
        import('./product/product.component')
          .then(m => m.ProductComponent)
    },
    {
      path: 'product-type/view/:id',
      loadComponent: () =>
        import('./product-type/product-type.component')
          .then(m => m.ProductTypeComponent)
    },
    {
      path: 'product-type/edit/:id',
      loadComponent: () =>
        import('./product-type/product-type.component')
          .then(m => m.ProductTypeComponent)
    },
    {
      path: 'lorry/view/:id',
      loadComponent: () =>
        import('./lorry/lorry.component')
          .then(m => m.LorryComponent)
    },
    {
      path: 'lorry/edit/:id',
      loadComponent: () =>
        import('./lorry/lorry.component')
          .then(m => m.LorryComponent)
    },
    {
      path: 'broker/view/:id',
      loadComponent: () =>
        import('./broker/broker.component')
          .then(m => m.BrokerComponent)
    },
    {
      path: 'broker/edit/:id',
      loadComponent: () =>
        import('./broker/broker.component')
          .then(m => m.BrokerComponent)
    },
    {
      path: 'stock',
      loadComponent: () =>
        import('./stock/stock.component')
            .then(m => m.StockComponent)
    },
    {
      path: 'stock/view/:id',
      loadComponent: () =>
        import('./stock/stock.component')
            .then(m => m.StockComponent)
    },

    {
      path: 'stock/edit/:id',
      loadComponent: () =>
        import('./stock/stock.component')
            .then(m => m.StockComponent)
  },
  {
    path: 'stock-master',
    loadComponent: () =>
        import('./stock-master/stock-master.component')
            .then(m => m.StockMasterComponent)
  },
{
  path: 'broker-master',
  loadComponent: () =>
    import('./broker/broker.component')
      .then(m => m.BrokerComponent),
  data: { mode: 'create' }
},

{
  path: 'broker-master/view/:id',
  loadComponent: () =>
    import('./broker/broker.component')
      .then(m => m.BrokerComponent),
  data: { mode: 'view' }
},

{
  path: 'broker-master/edit/:id',
  loadComponent: () =>
    import('./broker/broker.component')
      .then(m => m.BrokerComponent),
  data: { mode: 'edit' }
}
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];