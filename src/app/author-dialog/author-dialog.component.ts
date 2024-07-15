import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { BooksService } from '../books.service';
import { Book } from '../book';
import { Storage, getDownloadURL, ref } from '@angular/fire/storage';
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

  constructor(private booksService: BooksService) {}

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

  async downloadSelectedBooks() {
    if (this.selBooks.length > 0) {
      if (this.selBooks.length === 1) {
        const book = this.selBooks[0];
        const url = await this.getDownloadLink(book.link);
        saveAs(url, `${book.link}.epub`);
      } else {
        const zip = new JSZip();
        let autori: string[] = [];
        for (const book of this.selBooks) {
          const bAuthors = this.booksService.getAuthors([book]);
          for (const bAuthor of bAuthors) {
            let shortAuthor = '';
            if (bAuthor.includes('Mao')) {
              shortAuthor = 'mao';
            } else {
              shortAuthor = bAuthor
                .split(' ')
                [bAuthor.split(' ').length - 1].toLowerCase();
            }
            if (!autori.includes(shortAuthor)) {
              autori.push(shortAuthor);
            }
          }
          const url = await this.getDownloadLink(book.link);
          const response = await fetch(url);
          const blob = await response.blob();
          zip.file(`${book.link}.epub`, blob);
        }
        const content = await zip.generateAsync({ type: 'blob' });
        let title = '';
        if (autori.length == this.authors.length) {
          title = 'lvs-';
        } else {
          for (const autor of autori) {
            title = title + `${autor}-`;
          }
        }
        const link = URL.createObjectURL(content)
        saveAs(link, `${title}pack.zip`);
      }
    }
  }

  getDownloadLink(bookLink: string): Promise<string> {
    const bookDownloadLink = `${bookLink}-book`;
    const reference = ref(this.storage, bookDownloadLink);
    return getDownloadURL(reference);
  }
}
