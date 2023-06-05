import { Component, Input, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { BooksService } from './books.service';
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
import { Router } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AllQuotesComponent } from './all-quotes/all-quotes.component';

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
    this.booksService.initializeBooks(this.firestore);
  }
}
