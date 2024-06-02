import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Text } from '../text';
import { Book } from '../book';
import { Note } from '../note';
import { SpeechService } from '../speech.service';
import { Subscription } from 'rxjs';
import { TranslationSynthesisResult } from 'microsoft-cognitiveservices-speech-sdk';

@Component({
  selector: 'app-text-content',
  templateUrl: './text-content.component.html',
  styleUrls: ['./text-content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextContentComponent implements OnInit, OnDestroy {
  private wordBoundSubscription: Subscription | null = null;
  private audioSubscription: Subscription | null = null;

  @Input() text!: Text;
  @Input() book!: Book;

  playing: boolean = false;

  bold!: boolean;

  private timeouts: NodeJS.Timeout[] = [];
  reset: (() => void) | undefined;

  constructor(private speechService: SpeechService) {}

  ngOnDestroy(): void {
    console.log('destroy', this.text.idChr);
    if (this.wordBoundSubscription) {
      this.wordBoundSubscription.unsubscribe();
    }
    if (this.audioSubscription) {
      this.audioSubscription.unsubscribe();
    }
  }

  private cancelAllTimeouts() {
    // console.log(this.timeouts);
    if (this.timeouts.length > 0) {
      this.timeouts.forEach(clearTimeout);
    }
    if (this.reset) {
      this.reset();
      this.reset = undefined;
    }
    this.timeouts = [];
  }

  private stopAudio() {
    const audioElm = document.getElementById(
      `audio${this.text.idChr}`
    ) as HTMLAudioElement;
    if (audioElm) {
      audioElm.pause(); // Pause the audio
      audioElm.src = ''; // Optionally, reset the src to stop playback
    }
  }

  async ngOnInit(): Promise<void> {
    await this.waitForTextDefinition();
    this.wordBoundSubscription = this.speechService.wordBound$.subscribe(
      (wordBound) => {
        if (wordBound) {
          this.timeouts = [];
          const list = [...wordBound];
          const paragraph = list.shift();
          const duration = list.shift();
          const index = this.text.content.indexOf(paragraph);
          const element = document.getElementById(
            `${this.text.idChr}-${index}`
          ) as HTMLElement;
          // console.log(wordBound);
          if (element != null && list.length > 0) {
            const distanceFromTop = (element as HTMLElement).offsetTop - 64;

            // console.log({
            //   paragraph: paragraph,
            //   id: `${this.text.idChr}-${index}`,
            //   exists: element != null,
            // });

            window.scrollTo({
              top: distanceFromTop,
              behavior: 'smooth',
            });
            const original = element.innerHTML;
            for (let i = 0; i < list.length; i++) {
              const [newParagraph, offset] = list[i];

              if (
                newParagraph.replace(/<\s*[^>]*>/gi, '').length ==
                  paragraph.replace(/<\s*[^>]*>/gi, '').length &&
                this.playing
              ) {
                const timeoutId = setTimeout(() => {
                  element.innerHTML = newParagraph;
                  this.addNotesFunct(index);
                }, (offset + 5000) / 10000);
                this.timeouts.push(timeoutId);
              }
            }
            this.reset = () => {
              console.log('reset at ', index);
              element.innerHTML = original;
              this.addNotesFunct(index);
            };
            const timeoutId = setTimeout(this.reset, (duration + 5000) / 10000);
            this.timeouts.push(timeoutId);
          }
        } else {
          this.cancelAllTimeouts();
          this.stopAudio();
        }
      }
    );
    this.audioSubscription = this.speechService.audio$.subscribe(
      async (audio) => {
        if (audio != null) {
          this.playing = true;
          const audioElm = document.getElementById(
            `audio${this.text.idChr}`
          ) as HTMLAudioElement;
          audioElm.src = audio;
          audioElm.play().then(() => {
            this.playing = false;
          });
        } else {
          this.cancelAllTimeouts();
          this.stopAudio();
        }
      }
    );
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
            let parentElement = selection.anchorNode as HTMLElement;

            while (
              parentElement.id == undefined ||
              !parentElement.id.includes('content')
            ) {
              parentElement = parentElement.parentElement as HTMLElement;
            }

            let parentElementId = parentElement.id.split('content')[1];

            // console.log(parentElementId);
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
            // console.log(parentElementId);
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

    // this.bold = false;
    // document.getElementById(this.getBoldID())?.addEventListener('click', () => {
    //   if (this.bold === undefined) {
    //     this.bold = true;
    //   } else {
    //     this.bold = !this.bold;
    //   }
    //   this.addNotesFunct();
    //   console.log(`!!${this.bold}`);
    // });

    let target = window.location.href.split('#')[1];

    let textElement = document.querySelector('.titlu');
    // if (
    //   this.book.chapters.filter((c) => this.text.idChr.indexOf(c.idCh) == 0).length == 1
    // ) {
    //   target = this.text.idChr;
    // }
    if (target != undefined) {
      if (target.includes('cit') || target.includes('p')) {
        textElement = document.querySelector(`a#${target}`);
      } else {
        textElement = document.getElementById(target);
      }
    }

    if (textElement != document.querySelector('.titlu')) {
      const distanceFromTop = (textElement as HTMLElement).offsetTop - 48;
      window.scrollTo({
        top: distanceFromTop,
        behavior: 'smooth',
      });

      if (target.includes('cit') || target.includes('p')) {
        if (target.includes('cit') || target.includes('p')) {
          this.highlight(
            (textElement as HTMLElement).parentElement as HTMLElement
          );
        }
      }
    }

    this.addNotesFunct();
    this.speak(this.text);
  }

  togglePlay(): void {
    this.playing = !this.playing;
  }

  speak(text: Text) {
    const language = this.book.language;
    if (language == 'ro') {
      document.getElementById(`synthZone${text.idChr}`)!.innerHTML = `
      <button class="expand-btn" id="play${this.text.idChr}"><i class="fa fa-play"></i></button>
      <button class="expand-btn" id="stop${this.text.idChr}"><i class="fa fa-stop"></i></button>`;

      const readText = document.getElementById(
        `play${text.idChr}`
      ) as HTMLElement;
      const stopText = document.getElementById(
        `stop${text.idChr}`
      ) as HTMLElement;

      // if (this.playing) {
      //   readText.style.display = 'contents';
      //   stopText.style.display = 'none';
      // } else {
      //   readText.style.display = 'none';
      //   stopText.style.display = 'contents';
      // }

      const speech = this.speechService;

      if (readText != null) {
        readText.addEventListener('click', () => {
          console.log('play');
          this.cancelAllTimeouts();
          this.stopAudio();
          this.togglePlay();
          speech.textToSpeech(
            text,
            document.getElementById(`audio${text.idChr}`) as HTMLAudioElement,
            this.playing
          );
        });
      }

      if (stopText != null) {
        stopText.addEventListener('click', () => {
          console.log('stop');
          // const audioElm = document.getElementById(
          //   `audio${this.text.idChr}`
          // ) as HTMLAudioElement;
          // this.togglePlay();
          // audioElm.pause();
          speech.stop();
        });
      }
    }
  }

  highlight(element: HTMLElement) {
    let defaultBG = '';
    let defaultTransition = '';

    element.style.transition = 'background 1s';
    element.style.backgroundColor = '#c41616';

    setTimeout(function () {
      element.style.backgroundColor = defaultBG;
      setTimeout(function () {
        element.style.transition = defaultTransition;
      }, 1000);
    }, 1000);
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

  addNotesFunct(index: number | null = null): void {
    const notes = this.book.notes;
    let doc = document.getElementById(
      `content${this.text.idChr}`
    ) as HTMLElement;
    if (index != null) {
      doc = document.getElementById(
        `${this.text.idChr}-${index}`
      ) as HTMLElement;
    }
    const aTags = doc.querySelectorAll('a');
    const modal = document.getElementById('modal') as HTMLElement;
    const modalBody = document.getElementById('modal-inner') as HTMLElement;

    aTags.forEach((a) => {
      if (a.id.includes('n')) {
        const number = a.id.substring(1);
        const note = notes.filter((item) => item.idNote == number)[0];

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

  getNotes(): string[] {
    const joinedContent = this.text.content.join('');
    const notes = this.book.notes;
    const notesToReturn: Note[] = [];
    const stringToReturn: string[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(joinedContent, 'text/html');
    const aTags = doc.querySelectorAll('a');
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

  waitForTextDefinition(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.text !== undefined) {
        resolve();
      } else {
        setTimeout(() => {
          if (this.text !== undefined) {
            resolve();
          } else {
            reject(new Error('Text object remains undefined'));
          }
        }, 100);
      }
    });
  }
}
