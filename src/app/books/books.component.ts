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
  antologiiList: Array<Book> = [];
  capitalulList: Array<Book> = [];
  teoriiList: Array<Book> = [];
  contentList: Array<Book> = [];
  maoList: Array<Book> = [];

  constructor(private booksService: BooksService) {}

  ngOnInit(): void {
    sessionStorage.removeItem('book');
    this.booksService.books$.subscribe((books) => {
      this.booksList = books;
    });
    this.booksService.antologii$.subscribe((antologii) => {
      this.antologiiList = antologii;
    });
    this.booksService.capitalul$.subscribe((capitalul) => {
      this.capitalulList = capitalul;
    });
    this.booksService.teorii$.subscribe((teorii) => {
      this.teoriiList = teorii;
    });
    this.booksService.content$.subscribe((content) => {
      this.contentList = content;
    });
    this.booksService.mao$.subscribe((mao) => {
      this.maoList = mao;
    });
  }
}
