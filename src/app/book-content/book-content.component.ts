import {
  Component,
  Input,
  AfterViewInit,
  OnInit,
  AfterContentInit,
  inject,
} from '@angular/core';
import { Book } from '../book';
import { Chapter } from '../chapter';
import { Part } from '../part';
import { Text } from '../text';
import { Storage, getDownloadURL } from '@angular/fire/storage';
import { ref } from 'firebase/storage';

@Component({
  selector: 'app-book-content',
  templateUrl: './book-content.component.html',
  styleUrls: ['./book-content.component.css'],
})
export class BookContentComponent implements OnInit, AfterContentInit {
  @Input() book!: Book;
  @Input() id!: string;
  chapter!: Chapter;
  part!: Part;
  texts!: Text[];
  storage: Storage = inject(Storage);

  async ngOnInit(): Promise<void> {
    await this.waitForBookParts();
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
      } else if (this.id.includes('T')) {
        const t = this.id.split('T')[1];
        const cSearch = t.substring(0, 4);
        const chapter = this.book.chapters.filter((element) =>
          element.idCh.includes(cSearch)
        )[0];
        const texts = this.book.texts.filter(
          (item) =>
            item.idChr.includes(chapter.idCh) &&
            item.idChr.indexOf(chapter.idCh) == 0
        );
        const part = this.book.parts.filter(
          (item) => item.idPt.indexOf(chapter.idCh.split('.')[0]) == 0
        )[0];

        this.part = part;
        this.chapter = chapter;
        this.texts = texts;
      } else {
        window.location.href = this.book.link;
      }
    } else {
      console.log(this.book);
    }
  }

  async ngAfterContentInit(): Promise<void> {
    await this.waitForBookParts();
    const link = this.book.link;
    const chapters = this.book.chapters;
    let indexOf = this.book.chapters.indexOf(this.chapter);
    const prevBtn = document.querySelector('.prev-btn') as HTMLElement;
    const nextBtn = document.querySelector('.next-btn') as HTMLElement;
    const randomBtn = document.querySelector('.random-btn') as HTMLElement;

    prevBtn.addEventListener('click', function () {
      if (indexOf == 0) {
        indexOf = chapters.length - 1;
      } else {
        indexOf--;
      }
      window.location.href = `${link}?id=C${chapters[indexOf].idCh}`;
    });

    nextBtn.addEventListener('click', function () {
      if (indexOf == chapters.length) {
        indexOf = 0;
      } else {
        indexOf++;
      }
      window.location.href = `${link}?id=C${chapters[indexOf].idCh}`;
    });

    if (
      this.book.title.includes('Antologia') ||
      this.book.title.includes('Anthology')
    ) {
      randomBtn.addEventListener('click', function () {
        let x = indexOf;
        indexOf = Math.floor(Math.random() * chapters.length);
        while (indexOf <= 2 && indexOf != x) {
          indexOf = Math.floor(Math.random() * chapters.length);
        }
        window.location.href = `${link}?id=C${chapters[indexOf].idCh}`;
      });
    }

    (document.getElementById('cuprins') as HTMLElement).addEventListener(
      'click',
      function () {
        window.location.href = `./` + link;
      }
    );

    (document.getElementById('home') as HTMLElement).addEventListener(
      'click',
      function () {
        window.location.href = './';
      }
    );
  }

  getDownloadTitle(): string {
    return `\<i class="fa fa-file-download">\</i> Download ${this.book.title}`;
  }

  DownloadClick = (): void => {
    downloadFile(this.book, this.storage);
  };

  CitateClick = (): void => {
    const citItem = Math.floor(Math.random() * this.book.citate.length);
    window.location.href = `${this.book.link}?cit=${citItem}`;
  };

  getCitsTitle(): string {
    let res = `\<i class="fa fa-quote-right">\</i> Citate`;
    const authors = this.book.author.split(', ');
    res = res + ` din scrierile lui ${authors[0]}`;
    if (authors.length > 1) {
      for (let i = 1; i < authors.length - 1; i++) {
        res = res + `, ${authors[i]}`;
      }
      res = res + ` şi ${authors[authors.length - 1]}`;
    }
    return res;
  }

  waitForBookParts(): Promise<void> {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.book.parts) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100); // Check every 100ms
    });
  }
}

function downloadFile(book: Book, storage: Storage) {
  const filePath = book.link + '-book';
  const thing = ref(storage, filePath);
  getDownloadURL(thing).then((link) => {
    open(link)
  })
}
