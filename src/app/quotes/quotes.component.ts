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
  @Input() link!: string;
  @Input() linkBook!: string;
  @Input() title!: string;
  @Input() autori!: string[];

  async ngOnInit(): Promise<void> {
    await this.waitForCitate();

    const img = document.querySelector('.img-container') as HTMLElement;
    const author = document.getElementById('author') as HTMLElement;
    const titlu = document.getElementById('titlu') as HTMLElement;
    const info = document.getElementById('info') as HTMLElement;
    const an = document.getElementById('an') as HTMLElement;

    const item = this.citate.filter((item) => item.id == this.id)[0];
    console.log(item);
    let text = '';
    if (item.isItText == true) {
      while (text == '') {
        text = this.makeText(item);
      }
    } else {
      text = item.text as string;
    }
    img.innerHTML = `<img src="assets/profiles/${item.img}.svg" id="person-img" alt="" > </img>`;
    // console.log(img.innerHTML)
    author.innerHTML = item.autor;
    titlu.innerHTML = item.titlu.replace('./index.html', this.linkBook);
    info.innerHTML = text;
    if (!item.titlu.includes('Scrisoare către')) {
      an.innerHTML = item.an;
    } else {
      an.innerHTML = '';
    }

    const autori: string[] = [];
    this.citate.forEach((item) => {
      const autorx = item.autor.split(', ');
      autorx.forEach((autor) => {
        if (autor.includes('Mao')) {
          autor = 'mao';
        } else {
          autor = autor.split(' ')[autor.split(' ').length - 1].toLowerCase();
        }
        if (!autori.includes(autor)) {
          autori.push(autor);
        }
      });
    });
    console.log(autori);

    if (autori.length > 1) {
      const citate = this.citate;
      const link = this.link;
      (document.querySelector('.img-container') as HTMLElement).style.cursor =
        'pointer';
      (
        document.querySelector('.img-container') as HTMLElement
      ).addEventListener('click', function () {
        let res = `<div class="manyImg">`;
        autori.forEach((autor) => {
          res =
            res +
            `<div class="img-container" id="${autor}"><img src="assets/profiles/${autor}.svg" id="person-img" alt=""> </div>`;
        });
        res = res + '</div></div></div>';
        const quoteZone = document.querySelector('.quote') as HTMLElement;
        quoteZone.innerHTML = res;

        autori.forEach((autor) => {
          (quoteZone.querySelector(`#${autor}`) as HTMLElement).style.cursor =
            'pointer';
          (
            quoteZone.querySelector(`#${autor}`) as HTMLElement
          ).addEventListener('click', function () {
            let x = citate.indexOf(
              citate.filter((item2) => item2.id == item.id)[0]
            );
            let citat = citate[x];
            let currentItem = Math.floor(Math.random() * citate.length)
            while (!citate[currentItem].autor.toLowerCase().includes(autor)) {
              currentItem = Math.floor(Math.random() * citate.length);
            }
            citat = citate[currentItem];
            window.location.href = `${link}?cit=${citat.id}`;
          });
        });
      });
    }
  }

  makeText(cit: Citat): string {
    const text = (cit.text as string[]).filter(
      (item) => !item.includes('<img')
    );
    let i = Math.floor(Math.random() * text.length);
    let res = '';
    let res2 = text[i];
    while (res2.length < 2500 && i < text.length) {
      res = res + text[i];
      res2 = res2 + text[i + 1];
      i += 1;
    }
    res = res.replace(/<a[^<]+<\/a>/g, '');
    if (res == '' || res.length < 50) {
      return '';
    }
    return res;
  }

  async ngAfterContentInit(): Promise<void> {
    await this.waitForCitate();
    const bookElement = document.getElementById('book') as HTMLElement;

    const prevBtn = document.querySelector('.prev-btn') as HTMLElement;
    const nextBtn = document.querySelector('.next-btn') as HTMLElement;
    // const saveBtn = document.querySelector('.save') as HTMLElement;
    const randomBtn = document.querySelector('.random-btn') as HTMLElement;
    const home = document.getElementById('home') as HTMLElement;

    const link = this.link;
    const linkBook = this.linkBook;
    let currentItem = this.citate.indexOf(
      this.citate.filter((item) => item.id == this.id)[0]
    );
    const citate = this.citate;

    home.addEventListener('click', function () {
      window.location.href = '../';
    });

    bookElement.addEventListener('click', function () {
      window.location.href = linkBook;
    });
    prevBtn.addEventListener('click', function () {
      if (currentItem == 0) {
        currentItem = citate.length - 1;
      } else {
        currentItem--;
      }
      let citat = citate[currentItem];
      window.location.href = `./${link}?cit=${citat.id}`;
    });

    nextBtn.addEventListener('click', function () {
      if (currentItem == citate.length - 1) {
        currentItem = 0;
      } else {
        currentItem++;
      }
      let citat = citate[currentItem];
      window.location.href = `./${link}?cit=${citat.id}`;
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
      let citat = citate[currentItem];
      while (currentItem == x || citate[currentItem].autor == citate[x].autor) {
        currentItem = Math.floor(Math.random() * citate.length);
      }
      citat = citate[currentItem];
      window.location.href = `./${link}?cit=${citat.id}`;
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
function changeToPerson(arg0: string) {
  throw new Error('Function not implemented.');
}
