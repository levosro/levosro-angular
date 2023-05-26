import { Component, Input } from '@angular/core';
import { Text } from '../text';

@Component({
  selector: 'app-book-button',
  templateUrl: './book-button.component.html',
  styleUrls: ['./book-button.component.css'],
})
export class BookButtonComponent {
  @Input() text!: Text;
  @Input() ok!: boolean;

  onButtonClick() {
    this.ok = !this.ok;
    window.speechSynthesis.cancel();
  }

  getInnerHTML() {
    return `${this.text.title != '' ? this.text.title : this.text.info} ${
      this.ok ? '▲' : '▼'
    }`;
  }

  scrollToTop() {
    const textButton = document.getElementById(this.text.idChr);
    textButton?.scrollIntoView();
  }
}
