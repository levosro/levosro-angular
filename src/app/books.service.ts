import { Injectable, Input } from '@angular/core';
import { Book } from './book';
import { BookPageComponent } from './book-page/book-page.component';
import { HttpClient } from '@angular/common/http';
import booksInit from 'src/assets/books.mjs';
import {
  Firestore,
  collectionData,
  collection,
  DocumentData,
  CollectionReference,
} from '@angular/fire/firestore';

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

  // books = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    // const collection2 = collection(firestore, 'content');
    // this.content = collectionData(collection2);
  }

  @Input() content!: Observable<DocumentData>;

  // setData(data: any) {
  //   this.books.next(data);
  // }

  async initializeBooks(firestore: Firestore): Promise<void> {
    // const newBooks: Book[] = books;

    const books$ = collectionData(collection(firestore, `books`)) as Observable<
      Book[]
    >;

    // await Promise.all(

    books$.pipe(
      map((items) => {
        console.log(items)
        this._books.next(items);
        // collectionData(
        //   collection(firestore, `content/${item.link}/texts`)
        // ).subscribe((texts) => (item.texts = texts as Text[]));
        // collectionData(
        //   collection(firestore, `content/${item.link}/citate`)
        // ).subscribe((citate) => (item.citate = citate as Citat[]));
        // collectionData(
        //   collection(firestore, `content/${item.link}/chapters`)
        // ).subscribe((chapters) => (item.chapters = chapters as Chapter[]));
        // collectionData(
        //   collection(firestore, `content/${item.link}/parts`)
        // ).subscribe((parts) => (item.parts = parts as Part[]));
        // collectionData(
        //   collection(firestore, `content/${item.link}/notes`)
        // ).subscribe((notes) => (item.notes = notes as Note[]));


        // items.forEach((item) => {
        //   if (item.citate) {
        //     // item.texts = texts;
        //     const updatedCitate = item.citate.map((citat, index) => {
        //       const updatedCitat = { ...citat };
        //       updatedCitat.id = index + 1;

        //       return updatedCitat;
        //     });
        //     item.citate = updatedCitate;
        //   }
        //   item.chapters;
        //   if (item.parts) {
        //     item.parts =
        //       item.parts.length === 0
        //         ? [{ idPt: '1', title: item.title }]
        //         : item.parts;
        //   }
        //   const title = item.title;
        //   const book = newBooks.filter((item) => item.title == title)[0];
        //   const index = newBooks.indexOf(book);
        //   newBooks[index] = item;
        // });
      })
    );

    // this._books.next(newBooks);
  }

  // getTexts(content: Observable<DocumentData[]>): Observable<Text[]> {

  // }

  getTexts(book: Book, firestore: Firestore): Observable<Text[]> {
    console.log(1);
    return collectionData(
      collection(firestore, `content/${book.link}/texts`)
    ) as Observable<Text[]>;
  }

  getChapters(book: Book, firestore: Firestore): Observable<Chapter[]> {
    console.log(1);
    return collectionData(
      collection(firestore, `content/${book.link}/chapters`)
    ) as Observable<Chapter[]>;
  }

  getParts(book: Book, firestore: Firestore): Observable<Part[]> {
    console.log(1);
    return collectionData(
      collection(firestore, `content/${book.link}/parts`)
    ) as Observable<Part[]>;
  }

  getNotes(book: Book, firestore: Firestore): Observable<Note[]> {
    console.log(1);
    return collectionData(
      collection(firestore, `content/${book.link}/notes`)
    ) as Observable<Note[]>;
  }

  getCitate(book: Book, firestore: Firestore): Observable<Citat[]> {
    console.log(1);
    return collectionData(
      collection(firestore, `content/${book.link}/citate`)
    ) as Observable<Citat[]>;
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

  getAllCits(): Observable<Citat[]> {
    let d = 0;
    return this.books$.pipe(
      map((books) => {
        const resCit: Citat[] = [];
        books.forEach((book) => {
          if (book.language != 'en') {
            if (!book.title.includes('Citate din scrierile lui')) {
              book.texts.forEach((item) => {
                d += 1;
                resCit.push({
                  autor: item.author ?? book.author,
                  titlu: item.title
                    ? `<a href="${book.link}?id=T${item.idChr}#${item.idChr}">${
                        item.title
                      }<br/>(${item.sourceBook ?? book.title})</a>`
                    : `<a href="${book.link}?id=T${item.idChr}#${item.idChr}">${item.sourceBook}<br/>(${book.title})</a>`,
                  isItText: true,
                  text: item.content,
                  an: item.year ?? book.year,
                  img: item.image ?? book.img,
                  linkBook: book.link,
                  titluBook: book.title,
                  id: d,
                  idNota: 0,
                });
              });
            }
            book.citate.forEach((item) => {
              d += 1;
              resCit.push({
                ...item,
                id: d,
                idNota: item.id,
                isItText: false,
                linkBook: book.link,
                titluBook: book.title,
              });
            });
          }
        });
        d = 0;
        return resCit;
      })
    );
  }

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
