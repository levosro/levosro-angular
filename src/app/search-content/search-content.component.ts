import { Component } from '@angular/core';
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
export class SearchContentComponent {
  authors = BooksService.getAuthors();

  constructor(private http: HttpClient) {}

  getBooks(author: string) {
    const authorBooks = BooksService.getBooks(author);
    return authorBooks;
  }

  getIdentifier(one: string, book: Book) {
    return `${one}${book.title}`
  }

  getTexts(book: Book): any {
    new BooksService(this.http).getTexts(book).subscribe((data) => {
      return data;
    });
  }
  getCitate(book: Book): any {
    new BooksService(this.http).getCitate(book).subscribe((data) => {
      return data;
    });
  }
  getNotes(book: Book): any {
    new BooksService(this.http).getNotes(book).subscribe((data) => {
      return data;
    });
  }
}
