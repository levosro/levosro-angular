import { Component, Input } from '@angular/core';
import { Citat } from '../citat';
import { SearchComponent } from '../search/search.component';
import { Book } from '../book';

@Component({
  selector: 'app-cit-search-content',
  templateUrl: './cit-search-content.component.html',
  styleUrls: ['./cit-search-content.component.css'],
})
export class CitSearchContentComponent {
  @Input()
  cits!: Citat[];
  @Input() idntf!: string;
  @Input() book!: Book;

  replaceAnchors(titlu: string): string {
    return titlu.replace(/<\/*a[^>]*>/g, '');
  }

  ngAfterContentInit() {
    SearchComponent.Search2(
      'tr',
      this.idntf,
      'query',
      0,
      'books',
      [],
      this.cits,
      []
    );
  }
}
