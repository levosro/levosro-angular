import { AfterContentInit, Component, Input, OnInit } from '@angular/core';
import { Citat } from '../citat';
import { Book } from '../book';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css'],
})
export class QuotesComponent implements OnInit, AfterContentInit {
  @Input() citate!: Citat[];
  @Input() id!: number;
  @Input() book!: Book;

  async ngOnInit(): Promise<void> {
    await this.waitForCitate();

    const img = document.querySelector('.img-container') as HTMLElement;
    const author = document.getElementById('author') as HTMLElement;
    const titlu = document.getElementById('titlu') as HTMLElement;
    const info = document.getElementById('info') as HTMLElement;
    const an = document.getElementById('an') as HTMLElement;

    const item = this.citate.filter((item) => item.id == this.id)[0];
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

  async ngAfterContentInit(): Promise<void> {
    await this.waitForCitate();
    const bookElement = document.getElementById('book') as HTMLElement;

    const prevBtn = document.querySelector('.prev-btn') as HTMLElement;
    const nextBtn = document.querySelector('.next-btn') as HTMLElement;
    // const saveBtn = document.querySelector('.save') as HTMLElement;
    const randomBtn = document.querySelector('.random-btn') as HTMLElement;
    const home = document.getElementById('home') as HTMLElement;

    const book = this.book;
    let currentItem = this.id;
    const citate = this.citate;

    home.addEventListener('click', function () {
      window.location.href = '../';
    });

    bookElement.addEventListener('click', function () {
      window.location.href = book.link;
    });
    prevBtn.addEventListener('click', function () {
      if (currentItem == 0) {
        currentItem = citate.length - 1;
      } else {
        currentItem--;
      }
      let citat = citate[currentItem];
      window.location.href = `./citate.html?cit=${citat.id}`;
    });

    nextBtn.addEventListener('click', function () {
      if (currentItem == citate.length - 1) {
        currentItem = 0;
      } else {
        currentItem++;
      }
      let citat = citate[currentItem];
      window.location.href = `./${book.link}?cit=${citat.id}`;
    });

    // saveBtn.addEventListener('click', function () {
    //   let res = document.querySelector('app-quotes')!.innerHTML;
    //   document.getElementById('save-zone')!.innerHTML = res;
    //   let node1 = document.getElementById('save-zone') as HTMLElement;
    //   // node1.removeChild(node1.querySelector('div.title'));
    //   let node = node1.querySelector('div.quote') as HTMLElement;
    //   let n1 = node.querySelector('div.button-container') as HTMLElement;
    //   let n2 = node.querySelector('button.random-btn') as HTMLElement;
    //   let n3 = node.querySelector('#antologia') as HTMLElement;
    //   let n4 = node.querySelector('#home') as HTMLElement;
    //   node.removeChild(n1);
    //   node.removeChild(n2);
    //   node.removeChild(n3);
    //   node.removeChild(n4);
    //   if (node.querySelector('a') != null) {
    //     node.querySelector('a')!.style.textDecoration = 'none';
    //   }
    //   node.style.margin = '0';
    //   node.style.maxWidth = '500';
    //   html2canvas(node1).then(async function (canvas) {
    //     let xhr = new XMLHttpRequest();
    //     xhr.responseType = 'blob';
    //     xhr.onload = function () {
    //       let a = document.createElement('a');
    //       a.href = window.URL.createObjectURL(xhr.response);
    //       a.download = 'cit' + window.location.href.split('cit=')[1] + '.png';
    //       a.style.display = 'none';
    //       document.body.appendChild(a);
    //       a.click();
    //       a.remove();
    //     };
    //     xhr.open('GET', canvas.toDataURL('image/png'));
    //     xhr.send();
    //   });
    //   node1.innerHTML = '';
    // });

    randomBtn.addEventListener('click', function () {
      let x = currentItem;
      while (currentItem == x) {
        currentItem = Math.floor(Math.random() * citate.length);
      }
      let citat = citate[currentItem];
      window.location.href = `./${book.link}?cit=${citat.id}`;
    });
  }

  waitForCitate(): Promise<void> {
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
