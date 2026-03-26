import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LorryService } from '../services/lorry.service';

@Component({
  selector: 'app-lorry-master',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lorry.component.html',
  styleUrls: ['./lorry.component.css']
})
export class LorryComponent implements OnInit {

selectedRoutes: string[] = [];
lorryForm: FormGroup;
lorryCodes: any;
groups: any;

  constructor(
    private fb: FormBuilder,
    private lorryService: LorryService
  ) {

    this.lorryForm = this.fb.group({
      code: [''],
      name: [''],
      phoneNumber: [''],
      mobileNumber: [''],
      contactPerson: [''],
      address: [''],
      areaCovering: [''],
      routeCovering: [[]],
      active: [false]
    });

  }
  ngOnInit(): void {}

  // Handle route checkbox change
    onRouteChange(event: any) {

    const value = event.target.value;

    if (event.target.checked) {
      this.selectedRoutes.push(value);
    } else {
      const index = this.selectedRoutes.indexOf(value);
      if (index > -1) {
        this.selectedRoutes.splice(index, 1);
      }
    }

    this.lorryForm.patchValue({
      routeCovering: this.selectedRoutes
    });

  }

  saveLorry() {

    if (this.lorryForm.invalid) {
      return;
    }

    const lorryData = this.lorryForm.value;

    this.lorryService.addLorry(lorryData).subscribe({

      next: (res) => {
        console.log("Lorry Saved", res);
        alert("Lorry Saved Successfully");
        this.lorryForm.reset();
      },

      error: (err) => {
        console.error("Error saving lorry", err);
      }

    });

  }

  cancelForm() {
    this.lorryForm.reset();
  }

}