import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
} from '@angular/core';
import { BooksService } from '../books.service';
import { Book } from '../book';
import { Text } from '../text';
import { Observable, Subject, map, of, switchMap } from 'rxjs';
import { Citat } from '../citat';
import { Note } from '../note';

@Component({
  selector: 'app-search-content',
  templateUrl: './search-content.component.html',
  styleUrls: ['./search-content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchContentComponent implements OnInit {
  authors$!: Observable<string[]>;
  books$!: Observable<Book[]>;
  books!: Book[];
  authors!: string[];

  constructor(
    private booksService: BooksService,
    private elRef: ElementRef,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.books$ = this.booksService.books;
    if (this.books$ !== undefined) {
      this.books$
        .pipe(
          switchMap((books) => {
            if (books) {
              // console.log(books);
              this.books = books;
              // console.log(this.elRef.nativeElement.outerHTML);
              return this.booksService.getAuthors(books);
            } else {
              return of(null);
            }
          })
        )
        .subscribe({
          next: (authors) => {
            if (authors) {
              this.authors = authors;
              console.log(authors);
              this.changeDetector.markForCheck();
              // console.log(this.elRef.nativeElement.outerHTML);
              return;
            }
          },
          error: (error) => {
            console.error(error);
          },
        });
      // console.log(this.elRef.nativeElement.outerHTML);
    }
    // console.log(`!!${this.elRef.nativeElement.outerHTML}`);
  }

  private onDestroy$ = new Subject<void>();

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  getBooks(author: string): Book[] {
    let books: Book[] = [];

    this.books$
      .pipe(
        map((data: Book[]) =>
          data.filter((item) => {
            // console.log(item);
            return (
              item.author.includes(author) && !item.title.includes('Anthology')
            );
          })
        )
      )
      .subscribe((filteredBooks) => {
        books = filteredBooks;
      });

    // console.log(books);
    return books;
  }

  getBook(book: Book): Book {
    return book;
  }

  getNotes(book: Book): Note[] {
    return book.notes;
  }

  getCits(book: Book, author: string): Citat[] {
    if (!book.title.includes('Antologia Marx-Engels')) {
      return book.citate;
    } else {
      // Provide a fallback value of an empty array if `book.texts` is undefined
      const citate = book.citate || [];
      return citate.filter((item) => item.autor.includes(author));
    }
  }

  getTexts(book: Book, author: string): Text[] {
    if (book.title.includes('Citate din scrierile lui')) {
      return [];
    } else if (!book.title.includes('Antologia Marx-Engels')) {
      return book.texts;
    } else {
      // Provide a fallback value of an empty array if `book.texts` is undefined
      const texts = book.texts || [];
      return texts.filter((item) =>
        item.image.includes(author.split(' ')[1].toLowerCase())
      );
    }
  }

  getIdentifier(one: string, book: Book, autor: string) {
    return `${one}${book.title}${autor}`;
  }
}
