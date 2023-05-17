import { Component, Input } from '@angular/core';
import { Text } from '../text';
import { SearchComponent } from '../search/search.component';
import { Note } from '../note';
import { Book } from '../book';

@Component({
  selector: 'app-text-search-content',
  templateUrl: './text-search-content.component.html',
  styleUrls: ['./text-search-content.component.css'],
})
export class TextSearchContentComponent {
  @Input() texts!: Text[];
  @Input() notes!: Note[];
  @Input() idntf!: string;
  @Input() book!: Book;

  ngAfterViewInit() {
    SearchComponent.Search2(
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
}
