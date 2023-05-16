import { Component } from '@angular/core';
import { AntologiaMeService } from '../antologia-me.service';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-search-content',
  templateUrl: './search-content.component.html',
  styleUrls: ['./search-content.component.css'],
})
export class SearchContentComponent {
  marxTexts = AntologiaMeService.marxTexts;
  meNotes = AntologiaMeService.notes;
  marxCit = AntologiaMeService.marxCit;
}
