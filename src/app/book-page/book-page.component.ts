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
  cit: string | any;
  isItPCT!: boolean;
  isItCit!: boolean;
  // texts: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  async ngOnInit() {
    this.book = this.route.snapshot.data['book'] as Book;
    const url = new URL(window.location.href);
    this.id = url.searchParams.get('id');
    console.log('ID:', this.id);
    this.cit = url.searchParams.get('cit');
    console.log('CIT:', this.cit);
    if (url.searchParams.get('id') != null) {
      this.isItPCT = true;
    } else {
      this.isItPCT = false;
    }
    if (url.searchParams.get('cit') != null) {
      this.isItCit = true;
    } else {
      this.isItCit = false;
    }

    console.log(this.book);
    window.onclick = function (event) {
      const modal = document.querySelector(".modal") as HTMLElement;
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  }

  getDownloadTitle(): string {
    return `\<i class="fa fa-file-download">\</i> Download ${this.book.title}`;
  }

  CitateClick = (): void => {
    const citItem = Math.floor(Math.random() * this.book.citate.length);
    window.location.href = `${this.book.link}?cit=${citItem}`;
  }

  getCitsTitle(): string {
    let res = `\<i class="fa fa-quote-right">\</i> Citate`;
    const authors = this.book.author.split(', ')
    res = res + ` din scrierile lui ${authors[0]}`
    if (authors.length > 1) {
      for (let i = 1; i < authors.length - 1; i++) {
        res = res + `, ${authors[i]}`
      }
      res = res + ` şi ${authors[authors.length - 1]}`
    }
    return res;
  }
}
