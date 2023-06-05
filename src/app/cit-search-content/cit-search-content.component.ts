import { AfterViewInit, Component, Input, OnInit, inject } from '@angular/core';
import { Citat } from '../citat';
import { SearchComponent } from '../search/search.component';
import { Book } from '../book';
import { Observable, Subscription, map, of } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';
import { BooksService } from '../books.service';

@Component({
  selector: 'app-cit-search-content',
  templateUrl: './cit-search-content.component.html',
  styleUrls: ['./cit-search-content.component.css'],
})
export class CitSearchContentComponent implements AfterViewInit {
  @Input()
  cits!: Citat[];
  @Input() idntf!: string;
  @Input() author!: string;
  @Input() book!: Book;
  firestore: Firestore = inject(Firestore);

  constructor(private booksService: BooksService) {}

  replaceAnchors(titlu: string): string {
    return titlu.replace(/<\/*a[^>]*>/g, '');
  }

  getTitle(cit: Citat): string {
    return `${cit.autor}, ${this.replaceAnchors(cit.titlu)}`;
  }

  ngAfterViewInit() {
    this.getCits(this.book, this.author).subscribe((citate) => {
      this.cits = citate;
      SearchComponent.Search(
        'tr',
        this.idntf,
        'query',
        0,
        'books',
        [],
        this.cits,
        []
      );
    });
  }

  getCits(book: Book, author: string): Observable<Citat[]> {
    return this.booksService.getCitate(book, this.firestore).pipe(
      map((citate) => {
        const newCitate: Citat[] = [];
        let d = 0;
        citate.forEach((citat) => {
          d += 1;
          newCitate.push({
            ...citat,
            id: d,
          });
        });
        if (!book.title.includes('Antologia Marx-Engels')) {
          return newCitate || [];
        } else {
          return (newCitate || []).filter((item) =>
            item.autor.includes(author)
          );
        }
      })
    );
  }

  getId(cit: Citat): string {
    return cit.id.toString();
  }
}
