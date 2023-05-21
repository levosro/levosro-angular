import { Component, AfterContentInit } from '@angular/core';
import { Citat } from '../citat';
import { Note } from '../note';
import { Text } from '../text';
import { BooksService } from '../books.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements AfterContentInit {
  static searchField = document.querySelector('#query') as HTMLInputElement;

  ngAfterContentInit(): void {
    document
      .getElementById('form')!
      .addEventListener('submit', function (event) {
        event.preventDefault();
      });
  }

  static Search2(
    inputX: string,
    searchX: string,
    textInputX: string,
    startI: number,
    tocX: string,
    texts: Text[],
    citate: Citat[],
    notes: Note[]
  ): void {
    if (texts.length > 0 || citate.length > 0) {
      const input = document.getElementById(textInputX) as HTMLInputElement;
      const search = document.getElementById(searchX) as HTMLElement;
      const toc = document.getElementById(tocX) as HTMLElement;
      const textList = search.getElementsByTagName(
        inputX
      ) as HTMLCollectionOf<HTMLElement>;

      const handleKeyUp = SearchComponent.debounce(function () {
        let filter = input.value.toUpperCase();
        // console.log(texts)
        // console.log(filter);
        if (filter != '') {
          toc.style.display = 'none';
          (document.getElementById('search') as HTMLElement).style.display =
            'block';
        } else {
          toc.style.display = 'block';
          (document.getElementById('search') as HTMLElement).style.display =
            'none';
        }

        for (let i = startI; i < textList.length; i++) {
          const aElements = textList[i].querySelectorAll('a');
          for (let j = 0; j < aElements.length; j++) {
            let a = aElements[j].getAttribute('id') as string;

            let content = '';
            if (a.includes('CHR')) {
              content = SearchComponent.makeContent(a, false, texts, notes);
            } else {
              let x = parseInt(a.substring(3));
              let citat = citate.filter((item) => item.id == x)[0];
              if (citat != undefined) {
                content =
                  content +
                  citat.text
                    .normalize('NFD')
                    .replace(/\p{Diacritic}/gu, '')
                    .replace(/<[^>]*>/g, '');
              }
            }
            if (filter != '') {
              if (content.toUpperCase().indexOf(filter) > -1) {
                (textList[i] as HTMLElement).style.display = '';
                const aX = textList[i].getElementsByTagName('a')[0];
                let a = aX.getAttribute('id');
                if (content.toUpperCase().indexOf(filter) >= 0) {
                  let j = content.toUpperCase().indexOf(filter);
                  let res = '';
                  if (j > 20) {
                    res =
                      '<i>„...' +
                      content.substring(j - 20, j) +
                      `<b><u>${content.substring(
                        j,
                        j + filter.length
                      )}</b></u>` +
                      content.substring(
                        j + filter.length,
                        j + filter.length + 20
                      ) +
                      '...“</i>';
                  } else if (j == 0) {
                    res =
                      '<i>„' +
                      `<b><u>${content.substring(
                        j,
                        j + filter.length
                      )}</b></u>` +
                      content.substring(
                        j + filter.length,
                        j + filter.length + 25
                      ) +
                      '...“</i>';
                  } else {
                    res =
                      '<i>„' +
                      content.substring(0, j) +
                      `<b><u>${content.substring(
                        j,
                        j + filter.length
                      )}</b></u>` +
                      content.substring(
                        j + filter.length,
                        j + filter.length + 20
                      ) +
                      '...“</i>';
                  }

                  if ((a as string).includes('CHR')) {
                    let text = texts.filter(
                      (element) => element.idChr == (a as string).substring(3)
                    )[0];
                    const div = document.getElementById(`chr${text.idChr}`);
                    (div as HTMLElement).innerHTML = res;
                    const DIV = document.getElementById(`CHR${text.idChr}`);
                    // console.log(DIV.attributes.href.value)
                    const index = (DIV as HTMLAnchorElement).href.indexOf('#');
                    let toLookFor = content.substring(j, j + filter.length);
                    let content2 = SearchComponent.makeContent(
                      a,
                      true,
                      texts,
                      notes
                    );
                    let k = content2.indexOf(toLookFor);
                    let match;
                    const regex = /<a id="p(\d+)">/g;
                    let indices = [];
                    while ((match = regex.exec(content2)) !== null) {
                      indices.push(match.index);
                    }
                    indices = indices.filter((item) => item < k);
                    let k2 = indices[indices.length - 1];
                    content2 = content2.substring(
                      k2,
                      content2.indexOf('>', k2)
                    );
                    const result = content2.match(/"([^"]*)"/);

                    (DIV as HTMLAnchorElement).href =
                      (DIV as HTMLAnchorElement).href.substring(0, index) +
                      `#${result![1]}`;
                  } else {
                    let citat = citate.filter(
                      (element) =>
                        element.id == parseInt((a as string).substring(3))
                    )[0];
                    const div = document.getElementById(`cit${citat.id}`);
                    div!.innerHTML = res;
                  }
                } else {
                  let text = texts.filter(
                    (element) => element.idChr == (a as string).substring(3)
                  )[0];
                  const div = document.getElementById(`chr${text.idChr}`);
                  div!.innerHTML = '';
                }
              } else {
                textList[i].style.display = 'none';
                const aX = textList[i].getElementsByTagName('a')[0];
                let a = aX.getAttribute('id');
                if (a!.includes('CHR')) {
                  let text = texts.filter(
                    (element) => element.idChr == a!.substring(3)
                  )[0];
                  const div = document.getElementById(`chr${text.idChr}`);
                  div!.innerHTML = '';
                } else {
                  let citat = citate.filter(
                    (element) => element.id == parseInt(a!.substring(3))
                  )[0];
                  const div = document.getElementById(`cit${citat.id}`);
                  div!.innerHTML = '';
                }
              }
            } else {
              textList[i].style.display = 'none';
            }
          }
        }
      }, 300); // Adjust debounce time as needed

      handleKeyUp();
      input.addEventListener('keyup', handleKeyUp);
    }
  }

  static debounce(func: () => void, wait: number) {
    let timeout: number;
    return function (this: any, ...args: any[]) {
      clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        func.apply(this, args as []);
      }, wait);
    };
  }

  static makeContent(
    a: string | null,
    arg1: boolean,
    texts: Text[],
    notes: Note[]
  ): string {
    let content = '';
    a = a!.substring(3);
    let text = texts.filter((element) => element.idChr == a)[0];
    let contentList = text.content.filter((element) => !element.includes('<h'));
    if (arg1 === true) {
      content = contentList
        .join(' ')
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/<(?!(a id="p\d+"))[^>]+>/g, '');
    } else {
      content = contentList
        .join(' ')
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/<[^>]*>/g, '');
    }
    let notesListX = [...text.content.join(' ').matchAll(/\>\[[\d]+\]\</g)];
    let notesList: any[] = [];
    notesListX.forEach(function (item) {
      let item1 = item[0];
      let item2 = parseInt(item1.substring(2, item1.length - 2));
      if (item2 - 1 > notes.length) {
        notesList.push(notes[item2 - 1]);
      }
    });
    notesList = notesList.filter((item) => item != undefined);
    notesList.forEach(function (note) {
      if (arg1 === true) {
        content =
          content +
          ` ${note.content
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .replace(/<(?!(a id="p\d+"))[^>]+>/g, '')}`;
      } else {
        content =
          content +
          ` ${note.content
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .replace(/<[^>]*>/g, '')}`;
      }
    });
    return content;
  }

  // SearchComponent.searchField.addEventListener('keyup', handleKeyUp);
}
