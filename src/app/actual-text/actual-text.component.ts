import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Book } from '../book';

interface Content {
  value: string;
  safeValue: SafeHtml | null
  isItImg: boolean;
}

@Component({
  selector: 'app-actual-text',
  templateUrl: './actual-text.component.html',
  styleUrls: ['./actual-text.component.css'],
})
export class ActualTextComponent implements OnChanges {
  @Input() content!: string[];
  @Input() book!: Book;
  @Input() bold: boolean | undefined;

  safeContent!: Content[];

  constructor(private sanitizer: DomSanitizer) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bold']) {
      console.log('Bold value changed:', changes['bold'].currentValue);
      // Handle the bold value change in the child component
    }
    const oldContent = this.content;
    const boldContent: string[] = [];
    oldContent.forEach((item) => boldContent.push(this.processBold(item)));
    const procContent: Content[] = [];
    boldContent.forEach((item) => procContent.push(this.process(item)));
    const newContent: Content[] = [];
    procContent.forEach((cont) => {
      if (!cont.isItImg) {
        const newCont = this.sanitizer.bypassSecurityTrustHtml(cont.value);
        newContent.push({ safeValue: newCont, isItImg: cont.isItImg, value: cont.value });
      }
      else {
        newContent.push({ safeValue: cont.value, isItImg: cont.isItImg, value: cont.value });
      }
    });
    this.safeContent = newContent;
    // this.cdr.detectChanges();
  }

  process(content: string) {
    if (content.includes('<img')) {

      const parser = new DOMParser();
      const elm = parser.parseFromString(content, 'text/html').body.firstChild as HTMLImageElement;
      const alt = elm.src.split('Images/')[1]

      return { value: alt, isItImg: true, safeValue: null }
    }
    else return { value: content, isItImg: false, safeValue: null };
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
