import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Broker, BrokerService } from '../services/broker.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-broker-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './broker-list.component.html',
  styleUrls: ['./broker-list.component.css']
})

export class BrokerListComponent implements OnInit {

  broker: Broker[] = [];
  filteredBroker: Broker[] = [];
  searchText: string = '';

  currentPage = 1;
  pageSize = 5;

  constructor(private brokerService: BrokerService) {}

  ngOnInit(): void {
    this.loadBroker();
  }

  loadBroker() {
    this.brokerService.getBroker().subscribe(data => {
      this.broker = data;
      this.filteredBroker = data;
    });
  }

  searchBroker() {
    this.filteredBroker = this.broker.filter(b =>
      b.brokerName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      b.code?.toString().includes(this.searchText)
    );
  }

  get paginatedBroker() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredBroker.slice(start, start + this.pageSize);
  }

  nextPage() {
    if ((this.currentPage * this.pageSize) < this.filteredBroker.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

}