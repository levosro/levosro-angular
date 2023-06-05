import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../book';
import { HttpClient } from '@angular/common/http';
import { BooksService } from '../books.service';
import { Chapter } from '../chapter';
import { Text } from '../text';
import { Part } from '../part';
import { Firestore } from '@angular/fire/firestore';

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
  firestore: Firestore = inject(Firestore);

  constructor(
    private route: ActivatedRoute,
    private booksService: BooksService
  ) {}

  async ngOnInit() {
    this.book = this.route.snapshot.data['book'] as Book;

    this.booksService.getParts(this.book, this.firestore).subscribe((parts) => {
      this.book.parts =
        parts.length === 0 ? [{ idPt: '1', title: this.book.title }] : parts;
      this.booksService
        .getChapters(this.book, this.firestore)
        .subscribe((chapters) => {
          this.book.chapters = chapters;
          this.booksService
            .getCitate(this.book, this.firestore)
            .subscribe((cits) => {
              this.book.citate = cits;
              this.booksService
                .getNotes(this.book, this.firestore)
                .subscribe((notes) => {
                  this.book.notes = notes;
                  this.booksService
                    .getTexts(this.book, this.firestore)
                    .subscribe((texts) => {
                      this.book.texts = texts;


                    });
                });
            });
        });
    });

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
      const modal = document.querySelector('.modal') as HTMLElement;
      const modalClose = document.querySelector(
        '.fa-circle-xmark'
      ) as HTMLElement;
      if (event.target == modal) {
        modal.style.display = 'none';
      }
      if (event.target == modalClose) {
        modal.style.display = 'none';
      }
    };
  }

  getDownloadTitle(): string {
    return `\<i class="fa fa-file-download">\</i> Download ${this.book.title}`;
  }

  DownloadClick = (): void => {
    downloadFile(
      `assets/content/${this.book.link}/${this.book.link}.epub`,
      this.book.title
    );
  };

  CitateClick = (): void => {
    const citItem = Math.floor(Math.random() * this.book.citate.length);
    window.location.href = `${this.book.link}?cit=${citItem}`;
  };

  getImage(): string {
    return `assets/profiles/${this.book.img}.svg`;
  }

  getCitsTitle(): string {
    let res = `\<i class="fa fa-quote-right">\</i> Citate`;
    const authors = this.book.author.split(', ');
    res = res + ` din scrierile lui ${authors[0]}`;
    if (authors.length > 1) {
      for (let i = 1; i < authors.length - 1; i++) {
        res = res + `, ${authors[i]}`;
      }
      res = res + ` şi ${authors[authors.length - 1]}`;
    }
    return res;
  }
}

function downloadFile(url: string, fileName: string) {
  fetch(url, { method: 'get', mode: 'no-cors', referrerPolicy: 'no-referrer' })
    .then((res) => res.blob())
    .then((res) => {
      const aElement = document.createElement('a');
      aElement.setAttribute('download', fileName);
      const href = URL.createObjectURL(res);
      aElement.href = href;
      // aElement.setAttribute('href', href);
      aElement.setAttribute('target', '_blank');
      aElement.click();
      URL.revokeObjectURL(href);
    });
}
