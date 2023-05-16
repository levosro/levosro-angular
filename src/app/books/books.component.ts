import { Component } from '@angular/core';
import { BooksService } from '../books.service';
import books from 'src/assets/books.mjs';
import { Book } from '../book';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
})
export class BooksComponent {
  booksList: Array<Book>;
  bookService;
  constructor() {
    this.booksList = books as Book[];
    this.bookService = BooksService;
    BooksService;
  }
}
