import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { Citat } from '../citat';
import { SearchComponent } from '../search/search.component';
import { Book } from '../book';
import { Subscription, from, map, of } from 'rxjs';

@Component({
  selector: 'app-cit-search-content',
  templateUrl: './cit-search-content.component.html',
  styleUrls: ['./cit-search-content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitSearchContentComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  cits$!: Citat[];
  @Input() idntf!: string;
  @Input() book!: Book;

  replaceAnchors(titlu: string): string {
    return titlu.replace(/<\/*a[^>]*>/g, '');
  }

  getTitle(cit: Citat): string {
    return `${cit.autor}, ${this.replaceAnchors(cit.titlu)}`;
  }

  cits: Citat[] = [];
  private subscription: Subscription | undefined;

  ngOnInit() {
    this.subscription = of(this.cits$)
      .pipe(map((cits) => (this.cits = cits)))
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.cits != null) {
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

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
