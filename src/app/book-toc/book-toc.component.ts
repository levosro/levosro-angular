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

  ngOnInit(): void {
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
    return this.book.chapters.filter(
      (item: Chapter) => item.idCh.indexOf(part.idPt.split('.')[0]) == 0
    );
  }
}
