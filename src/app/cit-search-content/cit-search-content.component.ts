import { Component, Input, OnInit } from '@angular/core';
import { Citat } from '../citat';
import { SearchComponent } from '../search/search.component';
import { Book } from '../book';
import { Subscription, map, of } from 'rxjs';

@Component({
  selector: 'app-cit-search-content',
  templateUrl: './cit-search-content.component.html',
  styleUrls: ['./cit-search-content.component.css'],
})
export class CitSearchContentComponent implements OnInit {
  @Input()
  cits$!: Citat[];
  @Input() idntf!: string;
  @Input() book!: Book;

  cits: Citat[] = [];

  private citsSubscription: Subscription | undefined;

  replaceAnchors(titlu: string): string {
    return titlu.replace(/<\/*a[^>]*>/g, '');
  }

  getTitle(cit: Citat): string {
    return `${cit.autor}, ${this.replaceAnchors(cit.titlu)}`;
  }

  async ngOnInit() {
    this.citsSubscription = of(this.cits$)
      .pipe(map((cits) => (this.cits = cits)))
      .subscribe();
    SearchComponent.Search(
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

  getId(cit: Citat): string {
    return cit.id.toString();
  }
}
