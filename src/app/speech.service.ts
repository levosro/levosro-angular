import { Injectable, NgZone } from '@angular/core';
import { Text } from './text';
import { BehaviorSubject } from 'rxjs';

import { Functions, httpsCallable } from '@angular/fire/functions';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  private wordBoundSource = new BehaviorSubject<any[] | null>(null);
  wordBound$ = this.wordBoundSource.asObservable();

  private audio = new BehaviorSubject<string | null>(null);
  audio$ = this.audio.asObservable();

  private abortController: AbortController | null = null;

  constructor(private functions: Functions, private http: HttpClient) {}

  public textToSpeech(
    text: Text,
    audioElm: HTMLAudioElement,
    playing: boolean
  ) {
    const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
      const byteCharacters = window.atob(b64Data);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    };

    function waitForAudioToEnd(
      audioElement: HTMLAudioElement,
      duration: number
    ) {
      return new Promise((resolve, reject) => {
        // console.log({ audioElement });
        // if (!audioElement.paused) {
        // If the audio is playing, add event listeners for 'ended' and 'error' events
        audioElement.addEventListener('ended', resolve);
        audioElement.addEventListener('error', reject);
        // } else {
        //   // If the audio is not playing, resolve the promise immediately
        //   resolve;
        // }
      });
    }

    const doTheTalking = (list: string[], previousDuration: number) => {
      if (list.length > 0) {
        const paragraph = list.shift();
        var startTime = new Date().getTime(),
          endTime;
        callable({ text: paragraph }).then(
          async (response: any) => {
            endTime = new Date().getTime();
            const blob = b64toBlob(response.data.audio, 'audio/wav');
            const blobUrl = URL.createObjectURL(blob);
            if (
              text.content.indexOf(paragraph!) != 0 &&
              endTime - startTime < previousDuration / 10000
            ) {
              // console.log('start wait');
              await waitForAudioToEnd(audioElm, previousDuration);
              // console.log('wait is done');
            }
            this.audio.next(blobUrl);
            this.wordBoundSource.next([
              paragraph,
              response.data.duration,
              ...response.data.wordMap,
            ]);
            doTheTalking(list, response.data.duration);
          },
          (error: any) => {
            console.error(error);
          }
        );
      }
    };

    const callable = httpsCallable(this.functions, 'textToSpeech');
    doTheTalking([...text.content], 0);
  }

  public stop() {
    // Abort the ongoing HTTP request
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    // Reset the BehaviorSubjects
    this.wordBoundSource.next(null);
    this.audio.next(null);
  }
}
