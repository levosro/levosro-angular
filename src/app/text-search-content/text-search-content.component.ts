import { AfterViewInit, Component, Input, inject } from '@angular/core';
import { Text } from '../text';
import { SearchComponent } from '../search/search.component';
import { Note } from '../note';
import { Book } from '../book';
import { Observable, Subscription, from, map, of } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';
import { BooksService } from '../books.service';

@Component({
  selector: 'app-text-search-content',
  templateUrl: './text-search-content.component.html',
  styleUrls: ['./text-search-content.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextSearchContentComponent implements AfterViewInit {
  getInnerHTML(text: Text) {
    return text.info ? text.info : text.title;
  }
  @Input() texts!: Text[];
  @Input() notes!: Note[];
  @Input() idntf!: string;
  @Input() author!: string;
  @Input() book!: Book;
  firestore: Firestore = inject(Firestore);

  constructor(
    private booksService: BooksService // private changeDetector: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.getTexts(this.book, this.author).subscribe((texts) => {
      this.texts = texts;
      // this.changeDetector.markForCheck();
      this.getNotes(this.book).subscribe((notes) => {
        this.notes = notes;
        // this.changeDetector.markForCheck();
        SearchComponent.Search(
          'tr',
          this.idntf,
          'query',
          0,
          'books',
          this.texts,
          [],
          this.notes
        );
      });
    });
  }

  getNotes(book: Book): Observable<Note[]> {
    return this.booksService.getNotes(book, this.firestore).pipe(
      map((notes) => {
        return notes;
      })
    );
  }

  getTexts(book: Book, author: string): Observable<Text[]> {
    return this.booksService.getTexts(book, this.firestore).pipe(
      map((texts) => {
        if (book.title.includes('Citate din scrierile lui')) {
          return [];
        } else if (!book.title.includes('Antologia Marx-Engels')) {
          return texts || [];
        } else {
          return (texts || []).filter((item) =>
            item.image.includes(author.split(' ')[1].toLowerCase())
          );
        }
      })
    );
  }
}
