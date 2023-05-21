import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BooksService } from '../books.service';
import { Book } from '../book';
import { Text } from '../text';
import { Subject, takeUntil } from 'rxjs';
import { Citat } from '../citat';
import { Note } from '../note';

@Component({
  selector: 'app-search-content',
  templateUrl: './search-content.component.html',
  styleUrls: ['./search-content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchContentComponent implements OnInit {
  authors: string[] = [];
  books: Book[] = [];
  constructor(private booksService: BooksService) {}

  authorBooks: Array<any> = [];

  ngOnInit(): void {
    this.booksService.books$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((books) => {
        if (books) {
          this.books = books;
          this.authors = this.booksService.getAuthors();
          this.processBooks();
          console.log(this.authorBooks);
        }
      });
  }

  private onDestroy$ = new Subject<void>();

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  processBooks() {
    this.authorBooks = this.authors.map((author) => {
      const books = this.getBooks(author);
      return {
        author: author,
        books: books,
      };
    });
  }

  getBooks(author: string): Book[] {
    return this.books.filter(
      (item) =>
        item.author.includes(author) && !item.title.includes('Anthology')
    );
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
    if (!book.title.includes('Antologia Marx-Engels')) {
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
