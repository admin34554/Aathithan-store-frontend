import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrokerService } from '../services/broker.service';

@Component({
  selector: 'app-broker-master',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './broker.component.html',
  styleUrls: ['./broker.component.css']
})
export class BrokerComponent implements OnInit {

selectedRoutes: string[] = [];
brokerForm: FormGroup;
brokerCodes: any;
groups: any;

  constructor(
    private fb: FormBuilder,
    private brokerService: BrokerService
  ) {

    this.brokerForm = this.fb.group({
      code: [''],
      brokerName: [''],
      phoneNo: [''],
      mobileNo: [''],
      localComm: [''],
      address: [''],
      outComm: [''],
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

  }

  saveBroker() {

    if (this.brokerForm.invalid) {
      return;
    }

    const brokerData = this.brokerForm.value;

    this.brokerService.addBroker(brokerData).subscribe({

      next: (res) => {
        console.log("Broker Saved", res);
        alert("Broker Saved Successfully");
        this.brokerForm.reset();
      },

      error: (err) => {
        console.error("Error saving broker", err);
      }

    });

  }

  cancelForm() {
    this.brokerForm.reset();
  }

}