import { Injectable } from '@angular/core';
import { Book } from './book';
import { BookPageComponent } from './book-page/book-page.component';
import { HttpClient } from '@angular/common/http';
import booksInit from 'src/assets/books.mjs';
import {
  BehaviorSubject,
  ReplaySubject,
  firstValueFrom,
  lastValueFrom,
  of,
} from 'rxjs';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { Route } from './route';
import { Text } from './text';
import { Chapter } from './chapter';
import { Part } from './part';
import { Note } from './note';
import { Citat } from './citat';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private _books = new BehaviorSubject<Book[]>([]);
  books$ = this._books.asObservable();

  books = new BehaviorSubject<any>(null);

  setData(data: any) {
    this.books.next(data);
  }

  constructor(private http: HttpClient) {}

  async initializeBooks(books: Book[]): Promise<void> {
    const newBooks: Book[] = books;

    await Promise.all(
      books.map(async (item) => {
        const texts = await this.getTexts(item as Book);
        const citate = await this.getCitate(item as Book);
        const chapters = await this.getChapters(item as Book);
        const parts = await this.getParts(item as Book);
        const notes = await this.getNotes(item as Book);

        item.texts = texts;
        const updatedCitate = citate.map((citat, index) => {
          // Create a copy of the chapter object to avoid modifying the original object
          const updatedCitat = { ...citat };

          // Assign a growing ID to the updatedChapter object
          updatedCitat.id = index + 1;

          return updatedCitat;
        });
        item.citate = updatedCitate;
        item.chapters = chapters;
        item.parts =
          parts.length === 0 ? [{ idPt: '1', title: item.title }] : parts;
        item.notes = notes;

        const title = item.title;
        const book = newBooks.filter((item) => item.title == title)[0];
        const index = newBooks.indexOf(book);
        newBooks[index] = item;
      })
    );

    this._books.next(newBooks);
  }

  async getTexts(book: Book): Promise<Text[]> {
    const response = this.http.get(`assets/content/${book.link}/texts.json`);
    return await (lastValueFrom(response) as Promise<Text[]>);
  }

  async getChapters(book: Book): Promise<Chapter[]> {
    const response = this.http.get(`assets/content/${book.link}/chapters.json`);
    return await (lastValueFrom(response) as Promise<Chapter[]>);
  }

  async getParts(book: Book): Promise<Part[]> {
    const response = this.http.get(`assets/content/${book.link}/parts.json`);
    return await (lastValueFrom(response) as Promise<Part[]>);
  }

  async getNotes(book: Book): Promise<Note[]> {
    const response = this.http.get(`assets/content/${book.link}/notes.json`);
    return await (lastValueFrom(response) as Promise<Note[]>);
  }

  async getCitate(book: Book): Promise<Citat[]> {
    const response = this.http.get(`assets/content/${book.link}/citate.json`);
    return await (lastValueFrom(response) as Promise<Citat[]>);
  }

  async getBooks(autor: string): Promise<Book[]> {
    const books$ = this.books$.pipe(
      // tap((value) => console.log('Emitted value:', value)),
      // take(1),
      map((books) =>
        books.filter(
          (item) =>
            item.author.includes(autor) && !item.title.includes('Anthology')
        )
      )
    );
    return await (lastValueFrom(books$) as Promise<Book[]>);
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

  getAuthors(books: Book[]): Observable<string[]> {
    // const books = this._books.getValue();
    // console.log(books)
    const authors: string[] = [];
    const names: string[] = [];
    (books as Book[]).forEach((book) => {
      if (book.title.includes('Citate din scrierile')) {
        book.author = book.title.split('Citate din scrierile lui ')[1];
      }
      const items = book.author.split(', ');
      items.forEach((elm) => {
        const name = elm.split(' ')[1];
        if (!names.includes(name)) {
          authors.push(elm);
          names.push(name);
        }
      });
    });
    return of(Array.from(new Set(authors)));
  }

  getLinks(): Observable<Route[]> {
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

  getInitialLinks(): any[] {
    const links: any[] = [];
    booksInit.forEach((item) => {
      links.push({
        path: `${(item as Book).link}`,
        component: BookPageComponent,
        data: { book: item },
      });
    });
    return links;
  }
}
