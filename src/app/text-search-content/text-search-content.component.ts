import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Text } from '../text';
import { SearchComponent } from '../search/search.component';
import { Note } from '../note';
import { Book } from '../book';
import { Observable, Subscription, from, map, of } from 'rxjs';

@Component({
  selector: 'app-text-search-content',
  templateUrl: './text-search-content.component.html',
  styleUrls: ['./text-search-content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextSearchContentComponent implements OnInit {
  getInnerHTML(text: Text) {
    return text.info ? text.info : text.title;
  }
  @Input() texts$!: Text[];
  @Input() notes$!: Note[];
  @Input() idntf!: string;
  @Input() book$!: Book;

  texts: Text[] = [];
  notes: Note[] = [];
  book: Book | null = null;

  private textsSubscription: Subscription | undefined;
  private notesSubscription: Subscription | undefined;
  private bookSubscription: Subscription | undefined;

  ngOnInit() {
    this.textsSubscription = of(this.texts$)
      .pipe(map((texts) => (this.texts = texts)))
      .subscribe();
    this.notesSubscription = of(this.notes$)
      .pipe(map((notes) => (this.notes = notes)))
      .subscribe();
    this.bookSubscription = of(this.book$)
      .pipe(map((book) => (this.book = book)))
      .subscribe();
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
  }

  ngOnDestroy() {
    if (this.textsSubscription) {
      this.textsSubscription.unsubscribe();
    }
    if (this.notesSubscription) {
      this.notesSubscription.unsubscribe();
    }
    if (this.bookSubscription) {
      this.bookSubscription.unsubscribe();
    }
  }
}
