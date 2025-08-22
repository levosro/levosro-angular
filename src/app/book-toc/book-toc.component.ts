import { Component, Input, OnInit } from '@angular/core';
import { Book } from '../book';
import { Chapter } from '../chapter';
import { Text } from '../text';
import { Part } from '../part';

@Component({
  selector: 'app-book-toc',
  templateUrl: './book-toc.component.html',
  styleUrls: ['./book-toc.component.css'],
})
export class BookTocComponent implements OnInit {
  @Input() book!: Book;
  isItAnthology!: boolean;

  ngOnInit(): void {
    if (
      this.book.title.includes('Antologia') ||
      this.book.title.includes('Anthology')
    ) {
      this.isItAnthology = true;
    } else {
      this.isItAnthology = false;
    }
  }

  getHeaders(chapter: Chapter): string[] {
    const text = this.book.texts.filter(
      (item) => item.idChr == chapter.idCh
    )[0];
    const headers = text.content.filter(
      (item) => item.indexOf('<h') == 0 && !item.includes('h3')
    );
    return headers;
  }

  getHeaderLevel(header: string): number {
    const level = Number(header.split('<h')[1][0]);
    return level;
  }

  getAnchor(header: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(header, 'text/html');
    const headerHTML = doc.body.firstChild as HTMLElement;
    return headerHTML.id;
  }

  getTitle(header: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(header, 'text/html');
    const headerHTML = doc.body.firstChild as HTMLElement;
    if (headerHTML.title) {
      return headerHTML.title;
    } else {
      return headerHTML.textContent;
    }
  }

  getTitleOfChapter(chapter: Chapter): string {
    let ret = chapter.title.replace('<br/>', ' ');

    const texts = this.book.texts.filter(
      (item: Text) => item.idChr.indexOf(chapter.idCh) == 0
    );
    if (texts.length == 1) {
      let text = texts[0];
      if (text.author && text.year) {
        let extraInfo = '(';
        if (text.extra) {
          extraInfo = extraInfo + `${text.author}, ${text.year}`;
        }
        extraInfo = extraInfo + ')';
        if (extraInfo != '()') {
          ret = `${ret} <span class="extra">${extraInfo}</span>`;
        }
      }
    }

    return ret;
  }

  getTextsOfChapter(chapter: Chapter): Text[] {
    const texts = this.book.texts.filter(
      (item: Text) => item.idChr.indexOf(chapter.idCh) == 0
    );
    if (
      texts.length == 1 &&
      !(
        this.book.title.includes('Antologia') ||
        this.book.title.includes('Anthology')
      )
    ) {
      return [];
    } else return texts;
  }

  getChaptersOfPart(part: Part): Chapter[] {
    // console.log(this.book)
    return this.book.chapters.filter(
      (item: Chapter) => item.idCh.indexOf(part.idPt) == 0
    );
  }

  getFirstChapters(): Chapter[] | any {
    if (this.book.parts) {
      const firstPart = this.book.parts[0];
      const firstChapter = this.getChaptersOfPart(firstPart)[0];
      const index = this.book.chapters.indexOf(firstChapter);
      return this.book.chapters.filter(
        (item) => this.book.chapters.indexOf(item) < index
      );
    }
  }
}
