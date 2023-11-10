import { Injectable, Input } from '@angular/core';
import { Book } from './book';
import { BookPageComponent } from './book-page/book-page.component';
import { HttpClient } from '@angular/common/http';
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
  forkJoin,
  lastValueFrom,
  of,
} from 'rxjs';
import { combineLatest } from 'rxjs';
import { finalize, map, switchMap, take } from 'rxjs/operators';

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
  static booksNumber: number;

  // books = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    // const collection2 = collection(firestore, 'content');
    // this.content = collectionData(collection2);
  }

  @Input() content!: Observable<DocumentData>;

  // setData(data: any) {
  //   this.books.next(data);
  // }

  initializeBooks(firestore: Firestore): void {
    // const newBooks: Book[] = books;

    const books$ = collectionData(collection(firestore, `books`)) as Observable<
      Book[]
    >;

    books$.subscribe({
      next: (items) => {
        // console.log(items);
        BooksService.booksNumber = items.length;
        items = items.sort((a, b) => a.index - b.index);
        this._books.next(items);
      },
      complete: () => {
        console.log(BooksService.booksNumber);
        this._books.complete();
      },
    });
  }

  getTexts(book: Book, firestore: Firestore): Observable<Text[]> {
    console.log(`texts${book.link}`);
    return collectionData(
      collection(firestore, `content/${book.link}/texts`)
    ) as Observable<Text[]>;
  }

  getChapters(book: Book, firestore: Firestore): Observable<Chapter[]> {
    console.log(`chapters${book.link}`);
    return collectionData(
      collection(firestore, `content/${book.link}/chapters`)
    ) as Observable<Chapter[]>;
  }

  getParts(book: Book, firestore: Firestore): Observable<Part[]> {
    console.log(`parts${book.link}`);
    return collectionData(
      collection(firestore, `content/${book.link}/parts`)
    ) as Observable<Part[]>;
  }

  getNotes(book: Book, firestore: Firestore): Observable<Note[]> {
    console.log(`notes${book.link}`);
    return collectionData(
      collection(firestore, `content/${book.link}/notes`)
    ) as Observable<Note[]>;
  }

  getCitate(book: Book, firestore: Firestore): Observable<Citat[]> {
    console.log(`citate${book.link}`);
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

  collections$ = this.books$.pipe(
    map((books) => {
      const collections = books.map(book => book.collection)
      const uniqueCollections = new Set(collections);
      return [...uniqueCollections]
    })
  )

  antologii$ = this.books$.pipe(
    map((books) =>
      books.filter(
        (item) =>
          item.title.includes('Antologia') || item.title.includes('Anthology') || item.title.includes('Citate din scrierile lui Karl Marx')
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

  async getBooksCount(): Promise<number> {
    const count = await lastValueFrom(
      this._books.pipe(
        take(2),
        map((books) => books.filter((item) => item.language != 'en').length)
      )
    );
    return count;
  }

  getAllCits(firestore: Firestore): Observable<Citat[]> {
    let d = 0;
    const resCit = new BehaviorSubject<Citat[]>([]);
    this._books.subscribe({
      next: (books) => {
        books.forEach(async (book) => {
          const bookCit: Citat[] = [];
          if (book.language != 'en') {
            const citateObs = this.getCitate(book, firestore);
            const textsObs = this.getTexts(book, firestore);

            citateObs.subscribe((citate) => {
              book.citate = citate;
              book.citate.forEach((item) => {
                d += 1;
                bookCit.push({
                  ...item,
                  id: d,
                  idNota: item.id,
                  isItText: false,
                  linkBook: book.link,
                  titluBook: book.title,
                });
              });
              textsObs.subscribe((texts) => {
                book.texts = texts;
                if (!book.title.includes('Citate din scrierile lui')) {
                  book.texts.forEach((item) => {
                    d += 1;
                    bookCit.push({
                      autor: item.author ?? book.author,
                      titlu: item.title
                        ? `<a href="${book.link}?id=T${item.idChr}#${
                            item.idChr
                          }">${item.title}<br/>(${
                            item.sourceBook ?? book.title
                          })</a>`
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
                resCit.next([...resCit.value, ...bookCit]);
              });
            });
          }
        });
      },
      complete() {
        console.log('Books observable complete.');
        resCit.complete();
      },
    });
    return resCit.asObservable();
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

  getInitialLinks(firestore: Firestore): Observable<any[]> {
    const books$ = collectionData(collection(firestore, `books`)) as Observable<
      Book[]
    >;
    return books$.pipe(
      map((items) => {
        return items.map((item) => {
          return {
            path: `${(item as Book).link}`,
            component: BookPageComponent,
            data: { book: item },
          };
        });
      })
    );
  }
}
