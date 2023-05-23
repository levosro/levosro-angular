import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../book';
import { HttpClient } from '@angular/common/http';
import { BooksService } from '../books.service';
import { Chapter } from '../chapter';
import { Text } from '../text';
import { Part } from '../part';

@Component({
  selector: 'app-book-page',
  templateUrl: './book-page.component.html',
  styleUrls: ['./book-page.component.css'],
})
export class BookPageComponent implements OnInit {
  book!: Book;
  id: string | any;
  isItPCT!: boolean;
  // texts: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  async ngOnInit() {
    this.book = this.route.snapshot.data['book'] as Book;
    const url = new URL(window.location.href);
    this.id = url.searchParams.get('id');
    console.log('ID:', this.id);
    if (url.searchParams.get('id') != null) {
      this.isItPCT = true;
    } else {
      this.isItPCT = false;
    }

    console.log(this.book);
  }
}
