import { Injectable, OnInit } from '@angular/core';
import { Book } from './book';
import { RouterModule, Routes } from '@angular/router';
import { BookPageComponent } from './book-page/book-page.component';
import { HttpClient } from '@angular/common/http';
import { Text } from './text';
import { lastValueFrom } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import books from 'src/assets/books.mjs';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private _books = new BehaviorSubject<Book[]>([]);
  books$ = this._books.asObservable();

  constructor(private http: HttpClient) {}

  async initializeBooks(books: Book[]): Promise<void> {
    const newBooks: Book[] = [];

    books.forEach(async (item: Book) => {
      const promises: Promise<void>[] = [];
      // console.log(item);
      const textsPromise = this.getTexts(item as Book);
      const citatePromise = this.getCitate(item as Book);
      const chaptersPromise = this.getChapters(item as Book);
      const partsPromise = this.getParts(item as Book);
      const notesPromise = this.getNotes(item as Book);

      promises.push(
        lastValueFrom(textsPromise).then(
          (data) => ((item as Book).texts = data)
        ),
        lastValueFrom(citatePromise).then(
          (data) => ((item as Book).citate = data)
        ),
        lastValueFrom(chaptersPromise).then(
          (data) => ((item as Book).chapters = data)
        ),
        lastValueFrom(partsPromise).then(
          (data) => ((item as Book).parts = data)
        ),
        lastValueFrom(notesPromise).then(
          (data) => ((item as Book).notes = data)
        )
      );
      await Promise.all(promises);
      // console.log(item);
      // console.log(newBooks);
      newBooks.push(item);
      this._books.next(newBooks);
    });
    // await Promise.all(promises);
    // this._books.next(newBooks);
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

  antologii$ = this.books$.pipe(
    map((books) =>
      books.filter(
        (item) =>
          item.title.includes('Antologia') || item.title.includes('Anthology')
      )
    )
  );

  mao$ = this.books$.pipe(
    map((books) =>
      books.filter(
        (item) => item.link.includes('mao') && !item.title.includes('Antologia')
      )
    )
  );

  capitalul$ = this.books$.pipe(
    map((books) =>
      books.filter(
        (item) =>
          item.title.includes('Capitalul') ||
          item.title.includes('Bazele criticii')
      )
    )
  );

  teorii$ = this.books$.pipe(
    map((books) => books.filter((item) => item.title.includes('Teorii asupra')))
  );

  content$ = combineLatest([
    this.books$,
    this.antologii$,
    this.mao$,
    this.capitalul$,
    this.teorii$,
  ]).pipe(
    map(([books, antologii, mao, capitalul, teorii]) => {
      return books.filter(
        (item) =>
          !antologii.includes(item) &&
          !mao.includes(item) &&
          !capitalul.includes(item) &&
          !teorii.includes(item)
      );
    })
  );

  getAuthors(): string[] {
    const authors: string[] = [];
    const names: string[] = [];
    this.books$.subscribe((books) =>
      books.forEach((item: Book) => {
        if (item.title.includes('Citate din scrierile')) {
          item.author = item.title.split('Citate din scrierile lui ')[1];
        }
        const items = item.author.split(', ');
        items.forEach((elm) => {
          if (!names.includes(elm.split(' ')[1])) {
            authors.push(elm);
            // console.log(authors);
            names.push(elm.split(' ')[1]);
          }
        });
      })
    );
    return authors;
  }

  getLinks(): Observable<Object[]> {
    return this.books$.pipe(
      map((books) =>
        books.map((item: Book) => ({
          path: item.link,
          component: BookPageComponent,
          data: { book: item },
        }))
      )
    );
  }
}
