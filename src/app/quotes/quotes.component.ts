import { Component, Input, OnInit } from '@angular/core';
import { Citat } from '../citat';
import { Book } from '../book';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css'],
})
export class QuotesComponent implements OnInit {
  @Input() citate!: Citat[];
  @Input() id!: number;
  @Input() book!: Book;

  async ngOnInit(): Promise<void> {
    await this.waitForBookParts();

    const img = document.querySelector('.img-container') as HTMLElement;
    const author = document.getElementById('author') as HTMLElement;
    const titlu = document.getElementById('titlu') as HTMLElement;
    const info = document.getElementById('info') as HTMLElement;
    const an = document.getElementById('an') as HTMLElement;

    const item = this.citate.filter(item => item.id == this.id)[0];
    img.innerHTML = `<img src="assets/profiles/${item.img}.svg" id="person-img" alt="" > </img>`;
    // console.log(img.innerHTML)
    author.innerHTML = item.autor;
    titlu.innerHTML = item.titlu.replace('./index.html', this.book.link);
    info.innerHTML = item.text;
    if (!item.titlu.includes('Scrisoare către')) {
      an.innerHTML = item.an;
    } else {
      an.innerHTML = '';
    }
  }

  waitForBookParts(): Promise<void> {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.citate) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100); // Check every 100ms
    });
  }
}
