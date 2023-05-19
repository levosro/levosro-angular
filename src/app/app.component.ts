import { Component, OnInit } from '@angular/core';
import { BooksService } from './books.service';
import booksInit from 'src/assets/books.mjs';
import { Book } from './book';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'levos';
  books: Book[] = [];
  constructor(private booksService: BooksService) {}

  async ngOnInit(): Promise<void> {
    this.booksService.books$.subscribe((books) => {
      this.books = books;
    });

    this.booksService.initializeBooks(booksInit as Book[]);
  }
}



