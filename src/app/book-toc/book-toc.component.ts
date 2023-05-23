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
