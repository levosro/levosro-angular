import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../book';
import { HttpClient } from '@angular/common/http';
import { BooksService } from '../books.service';

@Component({
  selector: 'app-book-page',
  templateUrl: './book-page.component.html',
  styleUrls: ['./book-page.component.css'],
})
export class BookPageComponent implements OnInit {
  book: any;
  // texts: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  async ngOnInit() {
    this.book = this.route.snapshot.data['book'] as Book;
    new BooksService(this.http).getTexts(this.book).subscribe((data) => {
      this.book.texts = data;
    });
    new BooksService(this.http).getChapters(this.book).subscribe((data) => {
      this.book.chapters = data;
    });
    new BooksService(this.http).getNotes(this.book).subscribe((data) => {
      this.book.notes = data;
    });
    console.log(this.book)
  }
}
