import { Component, OnInit } from '@angular/core';
import { AntologiaMeService } from '../antologia-me.service';
import { SearchComponent } from '../search/search.component';
import { BooksService } from '../books.service';
import { Book } from '../book';
import { HttpClient } from '@angular/common/http';
import { Text } from '../text';


@Component({
  selector: 'app-search-content',
  templateUrl: './search-content.component.html',
  styleUrls: ['./search-content.component.css'],
})
export class SearchContentComponent implements OnInit {

  authors: string[] = [];
  constructor(private booksService: BooksService) {}

  ngOnInit(): void {
      this.authors = this.booksService.getAuthors()
  }

  getBooks(author: string) {
    const authorBooks = BooksService.getBooks(author);
    return authorBooks;
  }

  getIdentifier(one: string, book: Book, autor: string) {
    return `${one}${book.title}${autor}`;
  }
}
