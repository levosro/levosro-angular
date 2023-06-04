import { Component, Input, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { BooksService } from './books.service';
import booksInit from 'src/assets/books.mjs';
import { Book } from './book';
// import { AngularFireAuth } from '@angular/fire/auth';
import { loadLinks } from './app-routing.module';
import {
  Firestore,
  collectionData,
  collection,
  DocumentData,
} from '@angular/fire/firestore';

import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'levos';
  books: Book[] = [];
  @Input() content$!: Observable<DocumentData[]>;

  constructor(
    private booksService: BooksService,
    private auth: Auth = inject(Auth),
    private firestore: Firestore
  ) {
    const collection2 = collection(firestore, 'content');
    this.content$ = collectionData(collection2);
  }
  async ngOnInit(): Promise<void> {
    // console.log(this.content)
    // this.content$.subscribe(async (items) => {
    await this.booksService.initializeBooks(
      // booksInit as Book[],
      this.firestore
    );
    // });

    // this.booksService.books$.subscribe((books) => {
    //   this.books = books;
    //   console.log(books)
    //   this.booksService.setData(books);
    // });

    // loadLinks(this.booksService);
  }
}
