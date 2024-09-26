import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { BooksService } from '../books.service';
import { Book } from '../book';
import { Storage, getDownloadURL, ref } from '@angular/fire/storage';
import { Functions, httpsCallable } from '@angular/fire/functions';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-author-dialog',
  templateUrl: './author-dialog.component.html',
  styleUrls: ['./author-dialog.component.css'],
})
export class AuthorDialogComponent implements OnInit {
  @Output() closeDialogEvent = new EventEmitter<void>();
  isDialogOpen = false;
  authors: string[] = [];
  selAuthors: string[] = [];
  books: Book[] = [];
  selBooks: Book[] = [];
  allAuthorsSelected = false;
  allBooksSelected = false;
  authorsRetracted = false;
  booksRetracted = true;
  storage: Storage = inject(Storage);

  constructor(
    private booksService: BooksService,
    private functions: Functions
  ) {}

  ngOnInit(): void {
    if (this.booksService.books$ !== undefined) {
      this.booksService.books$.subscribe((books) => {
        if (books) {
          this.books = books;
          this.authors = this.booksService.getAuthors(books);
          this.selAuthors = [];
          this.selBooks = [];
          this.allAuthorsSelected = false;
          this.allBooksSelected = false;
        }
      });
    }
  }

  openDialog() {
    this.isDialogOpen = true;
  }

  closeDialog() {
    this.isDialogOpen = false;
    this.closeDialogEvent.emit();
  }

  toggleAuthorSelection(author: string) {
    if (this.selAuthors.includes(author)) {
      this.selAuthors = this.selAuthors.filter((a) => a !== author);
    } else {
      this.selAuthors.push(author);
    }
    this.updateSelectedBooks();
    this.allAuthorsSelected = this.selAuthors.length === this.authors.length;
    if (
      this.selAuthors.length > 0 &&
      this.selAuthors.length < this.authors.length
    ) {
      this.authorsRetracted = true;
    } else {
      this.authorsRetracted = false;
    }
  }

  toggleBookSelection(book: Book) {
    if (this.selBooks.includes(book)) {
      this.selBooks = this.selBooks.filter((b) => b !== book);
    } else {
      this.selBooks.push(book);
    }
    this.selAuthors = this.booksService.getAuthors(this.selBooks);
    this.allBooksSelected = this.selBooks.length === this.books.length;
    if (this.selBooks.length > 0) {
      this.booksRetracted = false;
      this.authorsRetracted = true;
    } else {
      this.booksRetracted = true;
      this.authorsRetracted = false;
    }
  }

  selectAllAuthors() {
    if (this.allAuthorsSelected) {
      this.selAuthors = [];
    } else {
      this.selAuthors = [...this.authors];
    }
    this.updateSelectedBooks();
    this.authorsRetracted = false;
    this.allAuthorsSelected = !this.allAuthorsSelected;
  }

  selectAllBooks() {
    if (this.allBooksSelected) {
      this.selBooks = [];
    } else {
      this.selBooks = [...this.books];
    }
    this.selAuthors = this.booksService.getAuthors(this.selBooks);
    this.allBooksSelected = !this.allBooksSelected;
    if (this.selBooks.length > 0) {
      this.booksRetracted = false;
    } else {
      this.booksRetracted = true;
    }
  }

  updateSelectedBooks() {
    if (this.selAuthors.length === 0) {
      this.selBooks = [];
    } else {
      let allBooks: Book[] = [];
      this.selAuthors.forEach((author) => {
        allBooks.push(
          ...this.books.filter((book) => book.author.includes(author))
        );
      });
      this.selBooks = Array.from(new Set(allBooks));
    }
    this.allBooksSelected = this.selBooks.length === this.books.length;
    if (this.selBooks.length > 0) {
      this.booksRetracted = false;
    } else {
      this.booksRetracted = true;
    }
  }

  toggleAuthorsSection() {
    this.authorsRetracted = !this.authorsRetracted;
  }

  toggleBooksSection() {
    this.booksRetracted = !this.booksRetracted;
  }

  b64toBlob(b64Data: string, contentType = '', sliceSize = 512) {
    const byteCharacters = window.atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  async downloadSelectedBooks() {
    let title = '';
    if (this.selBooks.length > 0) {
      if (this.selBooks.length === 1) {
        title = `${this.selBooks[0].link}.epub`;
      } else {
        const bAuthors = this.booksService.getAuthors(this.selBooks);
        // console.log(bAuthors)
        let autori: string[] = [];
        for (const bAuthor of bAuthors) {
          let shortAuthor = '';
          if (bAuthor.includes('Mao')) {
            shortAuthor = 'mao';
          } else {
            shortAuthor = bAuthor
              .split(' ')
              [bAuthor.split(' ').length - 1].toLowerCase();
          }
          autori.push(shortAuthor);
        }

        if (autori.length == this.authors.length) {
          title = 'lvs-';
        } else {
          for (const autor of autori) {
            title = title + `${autor}-`;
          }
        }
        title = title + 'pack.zip';
      }
    }

    const dialBtn = document.getElementById('dlBtn') as HTMLElement;
    const dialDisp = dialBtn.style.display;
    dialBtn.style.display = 'none';

    const dlTxt = document.getElementById('dlTxt') as HTMLElement;
    dlTxt.style.display = 'block';
    const dlCounter = document.getElementById('dlCounter') as HTMLElement;

    const callable = httpsCallable(this.functions, 'download');
    if (this.selBooks.length == 1) {
      dlCounter.innerHTML = '(0/1)';
      const response = await callable({
        books: [this.selBooks[0].link],
      });
      const blob = this.b64toBlob(response.data as string, 'application/epub');
      const blobUrl = URL.createObjectURL(blob);
      saveAs(blobUrl, title);
    } else {
      const zip = new JSZip();
      for (const book of this.selBooks) {
        dlCounter.innerHTML = `(${this.selBooks.indexOf(book)}/${
          this.selBooks.length
        })`;

        const response = await callable({
          books: [book.link],
        });

        const blob = this.b64toBlob(
          response.data as string,
          'application/epub'
        );
        zip.file(`${book.link}.epub`, blob);
      }
      const content = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
      });
      saveAs(content, title);
    }
    dialBtn.style.display = dialDisp;
    dlTxt.style.display = 'none';

    // const blob = new Blob([arrayBuffer], { type: 'application/epub+zip' });
  }
}
