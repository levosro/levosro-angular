import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-expanded-button',
  templateUrl: './expanded-button.component.html',
  styleUrls: ['./expanded-button.component.css'],
})
export class ExpandedButtonComponent {
  @Input()
  title!: string;
  ok = false;

  onButtonClick() {
    this.ok = !this.ok;
  }

  getTitle() {
    return this.title + ' ' + (this.ok ? '▲' : '▼')
  }
}
