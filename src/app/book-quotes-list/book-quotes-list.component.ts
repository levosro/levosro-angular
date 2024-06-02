import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Book } from '../book';
import { Citat } from '../citat';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-book-quotes-list',
  templateUrl: './book-quotes-list.component.html',
  styleUrls: ['./book-quotes-list.component.css'],
})
export class BookQuotesListComponent implements AfterViewInit {
  @Input() book!: Book;

  ngAfterViewInit(): void {
    let textElement = document.querySelector('.title');
    let target = window.location.href.split('#')[1];

    if (target != undefined && target.includes('citl')) {
      textElement = document.getElementById(target);
    }

    if (textElement != document.querySelector('.title')) {
      const distanceFromTop = (textElement as HTMLElement).offsetTop - 48;
      window.scrollTo({
        top: distanceFromTop,
        behavior: 'smooth',
      });
    }
  }

  content(cit: Citat): string[] {
    return [cit.text as string];
  }

  title(cit: Citat): string {
    return cit.titlu.replace(/<\s*[^>]*>/gi, '');
  }

  centerAlign(cit: Citat): void {
    const parser = new DOMParser();
    const doc = parser.parseFromString(cit.titlu, 'text/html');

    const firstLink = doc.querySelector('a');
    window.location.href = firstLink!
      .getAttribute('href')!
      .replace('index.html', this.book.link);
  }

  quoteRight(cit: Citat): void {
    window.location.href = `${this.book.link}?cit=${cit.id}`;
  }

  save(cit: Citat): void {
    let res = `<div class="img-container"><img src="assets/profiles/${cit.img}.svg" id="person-img" alt="" > </img></div> <h4 id="author">${cit.autor}</h4> <p id="titlu">${cit.titlu.replace(/<\s*[^>]*>/gi, '')}</p> <p id="an">${cit.an}</p> <div id="info">${cit.text}</div>`;
    document.getElementById('save-zone')!.innerHTML = res;
    let n1 = document.getElementById('save-zone') as HTMLElement;
    // node1.removeChild(node1.querySelector('div.title'));
    n1.style.padding = '2em';
    n1.style.width = '500px';
    if (n1.querySelector('a') != null) {
      n1.querySelector('a')!.style.textDecoration = 'none';
    }
    // return;
    html2canvas(n1).then(async function (canvas) {
      let xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function () {
        let a = document.createElement('a');
        a.href = window.URL.createObjectURL(xhr.response);
        a.download = 'cit' + cit.id + '.png';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
      };
      xhr.open('GET', canvas.toDataURL('image/png'));
      xhr.send();
    });
    n1.innerHTML = '';
  }
}
