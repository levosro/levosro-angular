import { Injectable, AfterContentInit } from '@angular/core';
import booksInit from 'src/assets/books.mjs';
import { Book } from './book';
import { RouterModule, Routes } from '@angular/router';
import { BookPageComponent } from './book-page/book-page.component';
import { HttpClient } from '@angular/common/http';
import { Text } from './text';
import { Observable } from 'rxjs';
import books from 'src/assets/books.mjs';

@Injectable({
  providedIn: 'root',
})
export class BooksService implements AfterContentInit {
  static books: Book[] = booksInit as Book[];
  constructor(private http: HttpClient) {}

  ngAfterContentInit(): void {
    const newBooks: Book[] = [];
    BooksService.books.forEach((item: Book) => {
      this.http
        .get(`assets/content/${item.link}/msj/texts.json`)
        .subscribe((data) => {
          item.texts = data as Text[];
          console.log('JSON data:', item);
          newBooks.push(item);
        });
      BooksService.books = newBooks;
    });
  }

  getTexts(book: Book): Observable<any> {
    return this.http.get(`assets/content/${book.link}/texts.json`);
  }

  getChapters(book: Book): Observable<any> {
    return this.http.get(`assets/content/${book.link}/chapters.json`);
  }

  getParts(book: Book): Observable<any> {
    return this.http.get(`assets/content/${book.link}/parts.json`);
  }

  getNotes(book: Book): Observable<any> {
    return this.http.get(`assets/content/${book.link}/notes.json`);
  }

  getCitate(book: Book): Observable<any> {
    return this.http.get(`assets/content/${book.link}/citate.json`);
  }

  static getBooks(autor: string): Book[] {
    return (books as Book[]).filter((item) =>
      item.author.includes(autor)
    ) as Book[];
  }

  static getAuthors(): string[] {
    const authors: string[] = [];
    const names: string[] = [];
    BooksService.books.forEach((item: Book) => {
      if (item.title.includes('Citate din scrierile')) {
        item.author = item.title.split('Citate din scrierile lui ')[1];
      }
      const items = item.author.split(', ');
      items.forEach((elm) => {
        console.log(elm);
        if (!names.includes(elm.split(' ')[1])) {
          authors.push(elm);
          names.push(elm.split(' ')[1]);
        }
      });
    });
    return authors;
  }

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
        data: { book: item },
      })
    );
    return links;
  }
}
