import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../services/product.service';
import { TaxService, Tax } from '../services/tax.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ProductTypeService, ProductType } from '../services/productType.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {

productForm!:FormGroup
taxList:Tax[]=[]
filteredCodes: ProductType[] = [];

onTypeBlur() {
  const productType = this.productForm.get('productType')?.value;

  if (!productType) {
    this.filteredCodes = [];
    return;
  }

  this.productTypeService.getByType(productType).subscribe(data => {
    this.filteredCodes = data;
  });
}

constructor(
  private fb:FormBuilder,
  private productService:ProductService,
  private taxService:TaxService,
  private translate: TranslateService,
  private productTypeService: ProductTypeService,
  private route: ActivatedRoute,
  private router: Router,
){
  const lang = localStorage.getItem('lang') || 'en';

  this.translate.setDefaultLang('en');
  this.translate.use(lang);
}

isViewMode = false;
isEditMode = false;
activeTab = 'details';

ngOnInit() {

    this.productForm = this.fb.group({

        productType: [''],
        productCode: [''],
        productName: [''],
        description: [''],
        weight: [''],
        noOfPacks: [''],
        rate: [''],

        productItems: this.fb.array([]),

        taxes: this.fb.array([])

    });

    this.loadTaxes();

this.route.paramMap.subscribe(params => {

    const id = params.get('id');

    if (id) {

        const url = this.router.url;

        if (url.includes('/product/view/')) {
            this.isViewMode = true;
            this.isEditMode = false;
        }

        if (url.includes('/product/edit/')) {
            this.isViewMode = false;
            this.isEditMode = true;
        }

        this.loadProduct(Number(id));

    }

});

}

get productItems(): FormArray {
  return this.productForm.get('productItems') as FormArray;
}

addProductItem() {

  this.productItems.push(
    this.fb.group({
      itemName: [''],
      itemDescription: [''],
      measure: [''],
      unit: ['']
    })
  );

}

removeProductItem(index: number) {
  this.productItems.removeAt(index);
}

get taxes():FormArray{
return this.productForm.get('taxes') as FormArray
}

loadTaxes(){

this.taxService.getTaxes().subscribe(data=>{

this.taxList=data

data.forEach(tax=>{

this.taxes.push(

this.fb.group({
taxId:[tax.id],
optionalStock:[''],
stockInHand:['']
})

)

})

})

}

saveProduct() {

    if (this.productForm.invalid) {
        this.productForm.markAllAsTouched();
        return;
    }

    const productData = this.productForm.getRawValue();

    // Get ID from URL
    const id = this.route.snapshot.paramMap.get('id');

    // EDIT
    if (id) {

        this.productService.updateProduct(
            Number(id),
            productData
        ).subscribe({

            next: (res) => {

                alert('Product Updated Successfully');

            },

            error: (error) => {

                console.error('Update Product Error:', error);

                alert('Failed to update product');

            }

        });

    }

    // ADD
    else {

        this.productService.saveProduct(productData).subscribe({

            next: (res) => {

                alert('Product Saved Successfully');

            },

            error: (error) => {

                console.error('Save Product Error:', error);

                alert('Failed to save product');

            }

        });

    }

}

loadProduct(id: number) {

    this.productService.getProductById(id).subscribe({

        next: (product) => {

            console.log('Loaded Product:', product);

            const productTypeMaster = product.productTypeMasters?.[0];

            this.productForm.patchValue({

                productType: productTypeMaster?.productType || '',
                productCode: productTypeMaster?.code || '',
                productName: product.productName || '',
                description: product.description || '',
                weight: product.weight || '',
                noOfPacks: product.noOfPacks || '',
                rate: product.rate || ''

            });

            if (productTypeMaster) {
                this.filteredCodes = [productTypeMaster];
            }

            this.loadProductItems(product);

            // VIEW MODE
            if (this.isViewMode) {
                this.productForm.disable();
            }

        },

        error: (error) => {
            console.error('Error loading product:', error);
        }

    });

}

loadProductItems(product: Product) {

    const items = this.productItems;

    items.clear();

    if (!product.productItems) {
        return;
    }

    product.productItems.forEach(item => {

        items.push(

            this.fb.group({

                id: [item.id],

                itemName: [item.itemName],

                itemDescription: [item.itemDescription],

                measure: [item.measure],

                unit: [item.unit]

            })

        );

    });

}

 resetForm() {

    this.productForm.reset();

    this.activeTab = 'details';

  }

  cancelForm(): void {
    this.router.navigate(['/product-list']);
  }

}