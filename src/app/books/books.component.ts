import { Component, OnInit } from '@angular/core';
import { BooksService } from '../books.service';
import { Book } from '../book';


@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
})
export class BooksComponent implements OnInit {
  booksList: Array<Book> = [];
  collections: Array<string> = [];

  constructor(private booksService: BooksService) {}

  ngOnInit(): void {
    sessionStorage.removeItem('book');
    this.booksService.books$.subscribe((books) => {
      this.booksList = books;
    });
    this.booksService.collections$.subscribe((collections) => {
      this.collections = collections;
    });
  }

  getCollectionBooks(collection: string): Array<Book> {
    return this.booksList.filter((book) => book.collection == collection)
  }
}
