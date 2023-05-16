import { Injectable } from '@angular/core';
import booksInit from 'src/assets/books.mjs';
import { Book } from './book';
import { RouterModule, Routes } from '@angular/router';
import { BookPageComponent } from './book-page/book-page.component';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  static books: Book[] = booksInit as Book[];
  // constructor() {
  //   BooksService.books = booksInit as Book[];
  // }

  static getAntologii(): any {
    return BooksService.books.filter(
      (item: Book) =>
        item.title.includes('Antologia') || item.title.includes('Anthology')
    );
  }
  static getMao(): any {
    return BooksService.books.filter(
      (item) => item.link.includes('mao') && !item.title.includes('Antologia')
    );
  }

  static getCapitalul(): any {
    return BooksService.books.filter(
      (item) =>
        item.title.includes('Capitalul') ||
        item.title.includes('Bazele criticii')
    );
  }

  static getTeorii(): any {
    return BooksService.books.filter((item) =>
      item.title.includes('Teorii asupra')
    );
  }
  static getContent(): any {
    let antologii = BooksService.books.filter(
      (item) =>
        item.title.includes('Antologia') || item.title.includes('Anthology')
    );
    let mao = BooksService.books.filter(
      (item) => item.link.includes('mao') && !item.title.includes('Antologia')
    );
    let capitalul = BooksService.books.filter(
      (item) =>
        item.title.includes('Capitalul') ||
        item.title.includes('Bazele criticii')
    );
    let teorii = BooksService.books.filter((item) =>
      item.title.includes('Teorii asupra')
    );
    return BooksService.books.filter(
      (item) =>
        !antologii.includes(item) &&
        !mao.includes(item) &&
        !capitalul.includes(item) &&
        !teorii.includes(item)
    );
  }

  static getLinks(): any {
    const links: Object[] = [];
    BooksService.books.forEach((item: Book) =>
      links.push({
        path: item.link,
        component: BookPageComponent,
        data: {book: item}
      })
    );
    return links;
  }
}
