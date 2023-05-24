import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Citat } from '../citat';
import { SearchComponent } from '../search/search.component';
import { Book } from '../book';

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

  replaceAnchors(titlu: string): string {
    return titlu.replace(/<\/*a[^>]*>/g, '');
  }

  getTitle(cit: Citat): string {
    return `${cit.autor}, ${this.replaceAnchors(cit.titlu)}`;
  }

  cits: Citat[] = [];

  async ngOnInit() {
    await this.waitForCits();
    console.log(this.cits$)
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

  waitForCits(): Promise<void> {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.cits$ != undefined) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100); // Check every 100ms
    });
  }
}
