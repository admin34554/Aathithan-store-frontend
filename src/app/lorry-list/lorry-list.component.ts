import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Lorry, LorryService } from '../services/lorry.service';
import { Router, RouterModule } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-lorry-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './lorry-list.component.html',
  styleUrls: ['./lorry-list.component.css']
})

export class LorryListComponent implements OnInit {

  lorry: Lorry[] = [];
  filteredLorry: Lorry[] = [];
  searchText: string = '';

  currentPage = 1;
  pageSize = 5;

  constructor(private lorryService: LorryService, private translate: TranslateService, private router: Router) {
        const lang = localStorage.getItem('lang') || 'en';

  this.translate.setDefaultLang('en');
  this.translate.use(lang);

  }

  ngOnInit(): void {
    this.loadLorry();
  }

  loadLorry() {
    this.lorryService.getLorry().subscribe(data => {
      this.lorry = data;
      this.filteredLorry = data;
    });
  }

  searchLorry() {
    this.filteredLorry = this.lorry.filter(l =>
      l.name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      l.code?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get paginatedLorry() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredLorry.slice(start, start + this.pageSize);
  }

  nextPage() {
    if ((this.currentPage * this.pageSize) < this.filteredLorry.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }



  viewLorry(id:number){
    this.router.navigate(['/lorry/view', id]);
  }

  editLorry(id:number){
    this.router.navigate(['/lorry/edit', id]);
  }
}