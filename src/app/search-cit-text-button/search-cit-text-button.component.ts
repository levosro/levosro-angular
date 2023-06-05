import { Component, Input, inject } from '@angular/core';
import { Book } from '../book';
import { Note } from '../note';
import { Citat } from '../citat';
import { Observable, map, of, switchMap } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';
import { BooksService } from '../books.service';

@Component({
  selector: 'app-search-cit-text-button',
  templateUrl: './search-cit-text-button.component.html',
  styleUrls: ['./search-cit-text-button.component.css']
})
export class SearchCitTextButtonComponent {
  @Input()
  title!: string;
  ok = false;
  authors$!: Observable<string[]>;
  books$!: Observable<Book[]>;
  books!: Book[];
  @Input() author!: string;
  firestore: Firestore = inject(Firestore);

  onButtonClick() {
    this.ok = !this.ok;
  }

  constructor(
    private booksService: BooksService,
  ) {}

  getBooks(author: string): Book[] {
    let books: Book[] = [];

    this.booksService.books$
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

  getIdentifier(one: string, book: Book, autor: string) {
    return `${one}${book.title}${autor}`;
  }
}
