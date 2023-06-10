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
    const distanceFromTop = textButton!.offsetTop - 48; // 3em = 48px (assuming font-size: 16px)
    document.documentElement.scrollTop = distanceFromTop; // set scrollTop of <html> element
  }

}
