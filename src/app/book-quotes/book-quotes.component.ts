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
    let jsonString = sessionStorage.getItem('book');
    let book2 = jsonString != null ? JSON.parse(jsonString) : null;

    if (book2 != null && book2.link == this.book.link) {
      this.cits$ = book2.citate;
      this.citat = this.cits$.filter((item) => item.id == +this.cit)[0];
      // console.log(jsonString)
    } else {
      this.citate$ = this.booksService.getCitate(this.book, this.firestore);

      this.citate$.pipe(take(1)).subscribe({
        next: (citate) => {
          citate.sort((a, b) => a.id - b.id);
          this.cits$ = citate;
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
}
