import { Component, Input } from '@angular/core';
import { Book } from '../book';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
})
export class BookComponent {
  @Input()
  book!: Book;
  constructor(private router: Router) {}
  onNavigate() {
    this.router.navigate([this.book.link]);
  }
}
