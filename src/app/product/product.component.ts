import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { TaxService, Tax } from '../services/tax.service';


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {

productForm!:FormGroup
taxList:Tax[]=[]

constructor(
  private fb:FormBuilder,
  private productService:ProductService,
  private taxService:TaxService
){}

ngOnInit(){

this.productForm=this.fb.group({

type:[''],
code:[''],
name:[''],
brandName:[''],
weight:[''],
retailRate:[''],
taxes:this.fb.array([])

})

this.loadTaxes()

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

saveProduct(){

const productData=this.productForm.value

this.productService.saveProduct(productData).subscribe(res=>{

alert("Product Saved")

})

}

}