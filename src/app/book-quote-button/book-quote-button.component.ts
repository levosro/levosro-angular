import { Component, Input } from '@angular/core';
import { Text } from '../text';
import { Book } from '../book';
import { SpeechService } from '../speech.service';

@Component({
  selector: 'app-book-quote-button',
  templateUrl: './book-quote-button.component.html',
  styleUrls: ['./book-quote-button.component.css'],
})
export class BookQuoteButtonComponent {
  @Input() book!: Book;
  @Input() ok!: boolean;
  @Input() title!: string;

  onButtonClick() {
    this.ok = !this.ok;
    this.speech.stop();
    // window.speechSynthesis.cancel();
  }

  constructor(private speech: SpeechService) {}

  scrollToTop() {
    const textButton = document.getElementById(`citate${this.book.link}`);
    const distanceFromTop = textButton!.offsetTop - 48; // 3em = 48px (assuming font-size: 16px)
    document.documentElement.scrollTop = distanceFromTop; // set scrollTop of <html> element
  }
}
