import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaxService, Tax } from '../services/tax.service';
import { ProductTypeService } from '../services/productType.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-type.component.html'

})
export class ProductTypeComponent {

  productTypeForm!:FormGroup
  taxList:Tax[]=[]
  
  constructor(
    private fb:FormBuilder,
    private productServiceType:ProductTypeService,
    private taxService:TaxService
  ){}
  
  ngOnInit(){
  
  this.productTypeForm=this.fb.group({
  
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
  return this.productTypeForm.get('taxes') as FormArray
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
  
  saveProductType(){
  
  const productData=this.productTypeForm.value
  
  this.productServiceType.saveProductType(productData).subscribe(res=>{
  
  alert("Product Saved")
  
  })
  
  }

}
