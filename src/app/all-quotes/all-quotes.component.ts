import { Component, Input, OnInit } from '@angular/core';
import { Citat } from '../citat';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { BooksService } from '../books.service';

@Component({
  selector: 'app-all-quotes',
  templateUrl: './all-quotes.component.html',
  styleUrls: ['./all-quotes.component.css'],
})
export class AllQuotesComponent implements OnInit {
  @Input() citate$!: Observable<Citat[]>;
  @Input() cit!: string | null;
  @Input() link!: string;
  @Input() title!: string;
  @Input() citat!: Citat;

  constructor(private booksService: BooksService) {}

  ngOnInit(): void {
    this.citate$ = this.booksService.getAllCits();
    this.citate$.subscribe((cits) => {
      console.log(cits);
      const url = new URL(window.location.href);
      this.cit = url.searchParams.get('cit');
      if (cits.length > 0) {
        if (this.cit == null) {
          window.location.href = `/citate?cit=${Math.floor(
            Math.random() * cits.length
          ).toString()}`;
        } else {
          const citat = cits.filter((item) => item.id == +(this.cit ?? 0))[0];
          this.citat = citat;
          this.link = citat.linkBook;
          this.title = citat.titluBook;
        }
      }
    });
  }
}
