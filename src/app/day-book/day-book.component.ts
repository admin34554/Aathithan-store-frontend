import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DayBook, DayBookService } from '../services/dayBook.service';

@Component({
  selector: 'app-daybook-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './day-book.component.html',
  styleUrls: ['./day-book.component.css']
})

export class DayBookListComponent implements OnInit {



fromDate: string = '';
toDate: string = '';

dayBookList: any[] = [];
currentPage = 1;
pageSize = 5;
paginatedData: any;

constructor(private dayBookService: DayBookService) {}

ngOnInit(): void {
  const now = new Date();
  const past = new Date();
  past.setDate(now.getDate() - 1);

  this.fromDate = past.toISOString().slice(0,16);
  this.toDate = now.toISOString().slice(0,16);

  this.loadDayBook();
}

formatDate(date: string): string {
  return date.split('T')[0]; // converts to yyyy-MM-dd
}

loadDayBook() {

  // const from = this.formatDate(this.fromDate);
  // const to = this.formatDate(this.toDate);

  this.dayBookService.getDayBook().subscribe(res => {
    this.dayBookList = this.mergeData(res);
  });
}

mergeData(res: any) {
  let list: any[] = [];

  // CASH
  res.cashBillList?.forEach((c: any) => {
    list.push({
      type: 'CASH',
      name: c.name,
      date: c.billDate,
      billNo: c.billNo,
      remarks: c.remarks
    });
  });

  // PURCHASE
  res.purchaseBillList?.forEach((p: any) => {
    list.push({
      type: 'PURCHASE',
      name: p.name,
      date: p.purchaseBillDate,
      billNo: p.poNo,
      remarks: p.remarks
    });
  });

  return list.sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

}