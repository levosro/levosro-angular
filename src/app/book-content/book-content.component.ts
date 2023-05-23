import { Component, Input, AfterViewInit } from '@angular/core';
import { Book } from '../book';
import { Chapter } from '../chapter';
import { Part } from '../part';
import { Text } from '../text';

@Component({
  selector: 'app-book-content',
  templateUrl: './book-content.component.html',
  styleUrls: ['./book-content.component.css'],
})
export class BookContentComponent implements AfterViewInit {
  @Input() book!: Book;
  @Input() id!: string;
  chapter!: Chapter;
  part!: Part;
  texts!: Text[];

  ngAfterViewInit(): void {
    console.log(this.book.parts)
    if (this.book.parts) {
      if (this.id.includes('P')) {
        const part = this.book.parts.filter(
          (item) => item.idPt.indexOf(this.id.split('P')[1]) == 0
        )[0];
        const chapter = this.book.chapters.filter(
          (item) => item.idCh.indexOf(part.idPt) == 0
        )[0];
        const texts = this.book.texts.filter(
          (item) => item.idChr.indexOf(chapter.idCh) == 0
        );

        this.part = part;
        this.chapter = chapter;
        this.texts = texts;
        console.log(this.part, this.chapter, this.texts);
      } else if (this.id.includes('C')) {
        const chapter = this.book.chapters.filter(
          (item) => item.idCh.indexOf(this.id.split('C')[1]) == 0
        )[0];
        const texts = this.book.texts.filter(
          (item) => item.idChr.indexOf(chapter.idCh) == 0
        );
        const part = this.book.parts.filter(
          (item) => item.idPt.indexOf(chapter.idCh.split('.')[0]) == 0
        )[0];

        this.part = part;
        this.chapter = chapter;
        this.texts = texts;
        console.log(this.part, this.chapter, this.texts);
      } else if (this.id.includes('T')) {
        const texts = this.book.texts.filter(
          (item) => item.idChr.indexOf(this.id.split('T')[1]) == 0
        );
        const t = this.id.split('T')[1];
        const cSearch = t.substring(0, 4);
        const chapter = this.book.chapters.filter((element) =>
          element.idCh.includes(cSearch)
        )[0];
        const part = this.book.parts.filter(
          (item) => item.idPt.indexOf(chapter.idCh.split('.')[0]) == 0
        )[0];

        this.part = part;
        this.chapter = chapter;
        this.texts = texts;
        console.log(this.part, this.chapter, this.texts);
      } else {
        window.location.href = this.book.link;
      }
    }
    else {
      console.log(this.book)
    }
  }
}
