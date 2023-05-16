import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../book';

@Component({
  selector: 'app-book-page',
  templateUrl: './book-page.component.html',
  styleUrls: ['./book-page.component.css'],
})
export class BookPageComponent implements OnInit {
  book: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.book = (this.route.snapshot.data['book'] as Book);
  }
}
