import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Text } from '../text';
import { Book } from '../book';
import { Note } from '../note';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-text-content',
  templateUrl: './text-content.component.html',
  styleUrls: ['./text-content.component.css'],
  // encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextContentComponent implements OnInit, OnChanges {
  @Input() text!: Text;
  @Input() book!: Book;

  bold!: boolean;

  constructor() {
  }

  async ngOnInit(): Promise<void> {
    window.speechSynthesis.cancel();
    await this.getVoices();
    if (
      window.speechSynthesis
        .getVoices()
        .filter((item) => item.lang.includes(this.book.language)).length > 0
    ) {
      this.speak(this.text);
    }
    document.addEventListener('copy', (event) => {
      if (event == null) {
        return;
      }
      let selection = document.getSelection();
      if (selection != null) {
        if (selection.toString() != '') {
          let anchorId = this.findNearestAnchorId(selection.anchorNode);
          if (anchorId != null) {
            let res = '';
            let parentElementId = (
              selection.anchorNode?.parentElement?.parentElement?.parentElement
                ?.parentElement?.parentElement as HTMLElement
            ).id.split('content')[1];

            console.log(parentElementId);
            const text = this.book.texts.filter(
              (item) => item.idChr == parentElementId
            )[0];

            res =
              res +
              (text.author ?? this.book.author) +
              ' — ' +
              (text.title
                ? `${text.title}<br/>(${text.sourceBook ?? this.book.title})`
                : `${text.sourceBook}<br/>(${this.book.title})`
              ).replace('<br/>', ' ');
            res =
              res +
              '\n' +
              window.location.href.substring(
                0,
                window.location.href.indexOf(this.book.link)
              );
            res = res + `${this.book.link}?id=T${parentElementId}#${anchorId}`;
            event.clipboardData!.setData(
              'text/plain',
              `${selection.toString()}\n\n${res}`
            );
          } else {
            let parentElementId = (
              selection.anchorNode?.parentElement?.parentElement?.parentElement
                ?.parentElement?.parentElement as HTMLElement
            ).id.split('content')[1];
            console.log(parentElementId);
            const text = this.book.texts.filter(
              (item) => item.idChr == parentElementId
            )[0];
            let res = '';
            res =
              res +
              (text.author ?? this.book.author) +
              ' — ' +
              (text.title
                ? `${text.title}<br/>(${text.sourceBook ?? this.book.title})`
                : `${text.sourceBook}<br/>(${this.book.title})`
              ).replace('<br/>', ' ');
            event.clipboardData!.setData(
              'text/plain',
              `${selection.toString()}\n\n${res}\n${window.location.href}`
            );
          }
          event.preventDefault();
        }
      }
    });
    const target = window.location.href.split('#')[1];
    if (target != undefined) {
      let textElement = document.querySelector('.titlu');
      if (target.includes('cit') || target.includes('p')) {
        textElement = document.querySelector(`a#${target}`);
      } else {
        textElement = document.getElementById(target);
      }
      const distanceFromTop = (textElement as HTMLElement).offsetTop - 48; // 3em = 48px (assuming font-size: 16px)
      window.scrollTo({
        top: distanceFromTop,
        behavior: 'smooth', // optional, adds scrolling animation
      });

      if (target.includes('cit') || target.includes('p')) {
        this.highlight(
          (textElement as HTMLElement).parentElement as HTMLElement
        );
      }
    }
    this.bold = false;
    document.getElementById(this.getBoldID())?.addEventListener('click', () => {
      if (this.bold === undefined) {
        this.bold = true;
      } else {
        this.bold = !this.bold;
      }
      this.addNotesFunct();
      console.log(`!!${this.bold}`);
    });
    this.addNotesFunct();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes['bold']);
  }

  speak(text: Text) {
    const language = this.book.language;
    document.getElementById(
      `synthZone${this.text.idChr}`
    )!.innerHTML = `<button class="expand-btn" id="play${text.idChr}"><i class="fa fa-play"></i></button>&nbsp;<button class="expand-btn" id="stop${text.idChr}"><i class="fa fa-stop"></i></button><div style="display: none"></div>`;
    const synth = window.speechSynthesis;
    const readText = document.getElementById(
      `play${text.idChr}`
    ) as HTMLElement;
    const stopText = document.getElementById(
      `stop${text.idChr}`
    ) as HTMLElement;
    // if (navigator.userAgent.indexOf('Win') != -1 && navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
    //   readText.addEventListener('click', function () {
    //     synth.cancel();
    //     let textToRead = Array.prototype.slice.call(
    //       (document.getElementById(`content${text.idChr}`) as HTMLElement)
    //         .children
    //     );
    //     for (let i = 0; i < text.content.length; i++) {
    //       if (text.content[i] != '<p>&nbsp;</p>') {
    //         let utterThis = new SpeechSynthesisUtterance();
    //         utterThis.voice = synth
    //           .getVoices()
    //           .filter((item) => item.lang.includes('ro'))[0];

    //         (
    //           document.getElementById(`synthZone${text.idChr}`)!
    //             .lastChild as HTMLElement
    //         ).innerHTML = text.content[i];
    //         let node = textToRead.filter(
    //           (item) =>
    //             (
    //               document.getElementById(`synthZone${text.idChr}`)!
    //                 .lastChild as HTMLElement
    //             ).innerHTML.replace(/<[^>]*>/g, '') ==
    //             item.innerHTML.replace(/<[^>]*>/g, '')
    //         )[0];
    //         utterThis.text = node.innerHTML;
    //         const saveNode1 = node.innerHTML;
    //         const saveNode = node.innerHTML;
    //         utterThis.onboundary = function (event) {
    //           if (event.charIndex >= 0) {
    //             let index = event.charIndex;
    //             let indexSp = saveNode1.indexOf(' ', index);
    //             if (indexSp == -1) {
    //               indexSp = saveNode1.length;
    //             }
    //             let innerHTML =
    //               saveNode.substring(0, event.charIndex) +
    //               '<span class="highlight">' +
    //               saveNode.substring(event.charIndex, indexSp) +
    //               '</span>' +
    //               saveNode.substring(indexSp);
    //             node.innerHTML = innerHTML;
    //             // anchorChanger();
    //           }
    //         };
    //         utterThis.onend = function () {
    //           node.innerHTML = saveNode1;
    //           // anchorChanger();
    //         };
    //         synth.speak(utterThis);
    //       }

    //       // utterThis.onstart = () => console.log()
    //     }
    //   });
    // } else {
    readText.addEventListener('click', function () {
      synth.cancel();
      for (let i = 0; i < text.content.length; i++) {
        let utterThis = new SpeechSynthesisUtterance();
        utterThis.voice = synth
          .getVoices()
          .filter((item) => item.lang.includes(language))[0];
        utterThis.text = text.content[i].replace(/<[^>]*>/g, '');
        synth.speak(utterThis);
      }
    });
    stopText.addEventListener('click', function () {
      synth.cancel();
    });
  }
  // }

  // anchorChanger() {
  //   let x = 0;
  //   let notesList = [];
  //   for (x = 1; x <= 320; x++) {
  //     if (document.getElementById(`n${x}`)) {
  //       notesList.push(x);
  //     }
  //   }
  //   let i = 0;
  //   if (notesList.length > 0) {
  //     for (i = 0; i < notesList.length; i++) {
  //       let x = notesList[i];

  //       let a = document.getElementById(`n${x}`);
  //       let note = notes.filter((item) => item.idNote == x)[0];
  //       a.onclick = function () {
  //         // console.log(note);
  //         modalBody.innerHTML = note.content;
  //         modal.style.display = 'block';
  //       };
  //     }
  //   }
  // }

  highlight(element: HTMLElement) {
    let defaultBG = element.style.backgroundColor;
    let defaultTransition = element.style.transition;

    element.style.transition = 'background 1s';
    element.style.backgroundColor = '#c41616';

    setTimeout(function () {
      element.style.backgroundColor = defaultBG;
      setTimeout(function () {
        element.style.transition = defaultTransition;
      }, 1000);
    }, 1000);
  }

  getVoices(): Promise<void> {
    return new Promise(function (myResolve, myReject) {
      let voices = window.speechSynthesis.getVoices();
      if (voices.length !== 0) {
        myResolve();
      } else {
        window.speechSynthesis.addEventListener('voiceschanged', function () {
          voices = window.speechSynthesis.getVoices();
          myResolve();
        });
      }
    });
  }

  findNearestAnchorId(node: Node | null) {
    while (
      node &&
      (node.nodeName !== 'A' ||
        (node instanceof Element && node.id && !node.id.includes('p')))
    ) {
      node = node.previousSibling;
    }
    return (node instanceof Element && node.id) || null;
  }

  addNotesFunct(): void {
    const notes = this.book.notes;
    const doc = document.getElementById(
      `content${this.text.idChr}`
    ) as HTMLElement;
    const aTags = doc.querySelectorAll('a');
    const modal = document.getElementById('modal') as HTMLElement;
    const modalBody = document.getElementById('modal-inner') as HTMLElement;
    // Iterate through the NodeList and perform desired actions
    aTags.forEach((a) => {
      if (a.id.includes('n')) {
        const number = a.id.substring(1);
        const note = notes.filter((item) => item.idNote == number)[0];
        // notesInText.push(note);
        if (note != undefined) {
          a.addEventListener('click', function () {
            modalBody.innerHTML = `${note.content}`;
            modal.style.display = 'block';
          });
        }
      }
    });
  }

  getBold(): string {
    return `<i class="fa-solid fa-eye"></i>`;
  }

  getBoldID(): string {
    return `boldButton${this.text.idChr}`;
  }

  // getBoldValue(): boolean {
  //   return this.bold;
  // }

  flipBold(): void {
    // this.cdr.markForCheck();
    // this.bold = !this.bold;
    // console.log(this.bold);
  }

  getNotes(): string[] {
    const joinedContent = this.text.content.join('');
    const notes = this.book.notes;
    const notesToReturn: Note[] = [];
    const stringToReturn: string[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(joinedContent, 'text/html');
    const aTags = doc.querySelectorAll('a');
    // Iterate through the NodeList and perform desired actions
    aTags.forEach((a) => {
      if (a.id.includes('n')) {
        const number = a.id.substring(1);
        const note = notes.filter((item) => item.idNote == number)[0];
        notesToReturn.push(note);
      }
    });
    notesToReturn.forEach((item) => {
      if (item != undefined) {
        stringToReturn.push(`<p class="noind">${item.content}</p>`);
      }
    });
    return stringToReturn;
  }
}
