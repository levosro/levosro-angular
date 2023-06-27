import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Book } from '../book';

@Component({
  selector: 'app-actual-text',
  templateUrl: './actual-text.component.html',
  styleUrls: ['./actual-text.component.css'],
})
export class ActualTextComponent implements OnChanges {
  @Input() content!: string[];
  @Input() book!: Book;
  @Input() bold: boolean | undefined;

  safeContent!: SafeHtml[];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bold']) {
      console.log('Bold value changed:', changes['bold'].currentValue);
      // Handle the bold value change in the child component
    }
    const oldContent = this.content;
    const boldContent: string[] = [];
    oldContent.forEach((item) => boldContent.push(this.processBold(item)));
    const procContent: string[] = [];
    boldContent.forEach((item) => procContent.push(this.process(item)));
    const newContent: SafeHtml[] = [];
    procContent.forEach((cont) => {
      const newCont = this.sanitizer.bypassSecurityTrustHtml(cont);
      newContent.push(newCont);
    });
    this.safeContent = newContent;
    // this.cdr.detectChanges();
  }

  process(content: string) {
    if (content.includes('<img')) {
      console.log(content);
      return `<div style="text-align: center;">${content.replace(
        './Images',
        `assets/content/${this.book.link}/Images`
      )}</div>`;
    } else return content;
  }

  processBold(content: string): string {
    let clearContents = content.replace(/<[^>]*>/g, '').split(' ');
    let contents = content.split(' ');
    const syllables: string[] = [];
    clearContents.forEach((item) =>
      syllables.push(this.getFirstSyllable(item.replace(/<[^>]*>/g, '')))
    );
    // console.log(syllables);
    // console.log(contents)
    if (this.bold == true) {
      contents.forEach((item) => {
        if (clearContents.includes(item.replace(/<[^>]*>/g, ''))) {
          const index = clearContents.indexOf(item.replace(/<[^>]*>/g, ''));
          const index2 = contents.indexOf(item);
          contents[index2] = contents[index2].replace(
            syllables[index],
            `<b>${syllables[index]}</b>`
          );
        }
      });
    }
    // console.log(bold);
    return contents.join(' ');
  }

  getFirstSyllable(word: string): string {
    const vowels = [
      'a',
      'e',
      'i',
      'o',
      'u',
      'î',
      'â',
      'A',
      'E',
      'I',
      'O',
      'U',
      'Î',
      'Â',
    ];
    let firstSyllable = '';

    let i = 0;
    if (word.includes('<')) {
      return '';
    }

    for (i; i < word.length; i++) {
      const char = word[i];

      if (vowels.includes(char)) {
        firstSyllable += char;

        if (i + 1 < word.length && !vowels.includes(word[i + 1])) {
          break;
        }
      } else {
        firstSyllable += char;
      }
    }

    return firstSyllable;
  }
}
