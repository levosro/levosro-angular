import { Injectable } from '@angular/core';
import parts from 'src/assets/antologia-me/parts.mjs';
import chapters from 'src/assets/antologia-me/chapters.mjs';
import texts from 'src/assets/antologia-me/texts.mjs';
import citate from 'src/assets/antologia-me/citate.mjs';
import notes from 'src/assets/antologia-me/notes.mjs';
import { Chapter } from './chapter';
import { Text } from './text';
import { Note } from './note';
import { Citat } from './citat';

@Injectable({
  providedIn: 'root',
})
export class AntologiaMeService {
  constructor() {}

  static texts: Text[] = texts as Text[];
  static chapters: Chapter[] = chapters as Chapter[];
  static notes: Note[] = notes as Note[];

  static marxTexts: Text[] = (texts as Text[]).filter(
    (item) =>
      (item as Text).image.includes('marx') &&
      !(item as Text).image.includes('engels')
  );

  static marxCit: Citat[] = (citate as Citat[]).filter(
    (item) =>
      (item as Citat).img.includes('marx') &&
      !(item as Citat).img.includes('engels')
  );
}
