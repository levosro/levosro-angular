import { Component, Input, OnInit, inject } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Citat } from '../citat';
import { BooksService } from '../books.service';
import { Book } from '../book';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-book-quotes',
  templateUrl: './book-quotes.component.html',
  styleUrls: ['./book-quotes.component.css'],
})
export class BookQuotesComponent implements OnInit {
  @Input() citate$!: Observable<Citat[]>;
  @Input() cits$!: Citat[];
  @Input() cit!: string;
  @Input() link!: string;
  @Input() title!: string;
  @Input() citat!: Citat;
  @Input() book!: Book;
  // firestore: Firestore = inject(Firestore);

  constructor(
    private booksService: BooksService,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.citate$ = this.booksService.getCitate(this.book, this.firestore);

    this.citate$.pipe(take(1)).subscribe({
      next: (citate) => {
        let d = 0;
        this.cits$ = [];
        citate.forEach((cit) => {
          d += 1;
          this.cits$.push({ ...cit, id: d });
        });
        // this.cits$ = citate;
      },
      complete: () => {
        // console.log(this.cits$);
        // console.log(+this.cit)
        this.citat = this.cits$.filter((item) => item.id == +this.cit)[0];
        // console.log(this.citat);
      },
    });
  }
}
