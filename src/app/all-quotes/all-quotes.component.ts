import {
  AfterContentInit,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { Citat } from '../citat';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  finalize,
  lastValueFrom,
  map,
  take,
} from 'rxjs';
import { BooksService } from '../books.service';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-all-quotes',
  templateUrl: './all-quotes.component.html',
  styleUrls: ['./all-quotes.component.css'],
})
export class AllQuotesComponent implements OnInit {
  @Input() citate$!: Observable<Citat[]>;
  @Input() cits$!: Citat[];
  @Input() cit!: string | null;
  @Input() link!: string;
  @Input() title!: string;
  @Input() citat!: Citat;
  @Input() booksNumber!: number;
  firestore: Firestore = inject(Firestore);

  constructor(private booksService: BooksService) {}

  async ngOnInit(): Promise<void> {
    this.cits$ = [];
    this.citate$ = this.booksService.getAllCits(this.firestore);
    this.booksNumber = await this.booksService.getBooksCount();
    // console.log(this.booksNumber);
    this.citate$.pipe(take(BooksService.booksNumber)).subscribe({
      next: (items) => {
        // console.log(items.length)
        this.cits$ = items;
      },
      complete: () => {
        console.log(this.cits$.length);
        const url = new URL(window.location.href);
        this.cit = url.searchParams.get('cit');
        // console.log(this.cit)
        if (this.cits$.length > 0) {
          if (this.cit == null) {
            window.location.href = `/citate?cit=${Math.floor(
              Math.random() * this.cits$.length
            ).toString()}`;
          } else {
            console.log(this.cits$);
            const citat = this.cits$.filter(
              (item) => item.id == +(this.cit ?? 0)
            )[0];
            this.citat = citat;
            this.link = citat.linkBook;
            this.title = citat.titluBook;
          }
        }
      },
    });

    // this.citate$.subscribe((cits$) => {
  }
}
