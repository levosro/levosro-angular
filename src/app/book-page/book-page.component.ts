import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../book';
import { BooksService } from '../books.service';
import { Firestore } from '@angular/fire/firestore';
import { Storage, getDownloadURL } from '@angular/fire/storage';
import { ref } from 'firebase/storage';

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
  storage: Storage = inject(Storage);

  constructor(
    private route: ActivatedRoute,
    private booksService: BooksService
  ) { }

  async ngOnInit() {
    this.book = this.route.snapshot.data['book'] as Book;

    let jsonString = sessionStorage.getItem('book');
    let book2 = jsonString != null ? JSON.parse(jsonString) : null;

    if (book2 != null && book2.link == this.book.link) {
      this.book = book2
      console.log(jsonString)
    }
    else {

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
                        sessionStorage.setItem('book', JSON.stringify(this.book));
                      });
                  });
              });
          });
      });
    }

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
    downloadFile(this.book, this.storage);
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

function downloadFile(book: Book, storage: Storage) {
  const filePath = book.link + '-book';
  const thing = ref(storage, filePath);
  getDownloadURL(thing).then((link) => {
    open(link)
  })
}
