import { Injectable } from '@angular/core';
import parts from 'src/assets/antologia-lenin/msj/parts.mjs';
import chapters from 'src/assets/antologia-lenin/msj/chapters.mjs';
import texts from 'src/assets/antologia-lenin/msj/texts.mjs';
import citate from 'src/assets/antologia-lenin/citate/citate.mjs';
import notes from 'src/assets/antologia-lenin/msj/notes.mjs';
import { Chapter } from './chapter';
import { Text } from './text';
import { Note } from './note';
import { Citat } from './citat';

@Injectable({
  providedIn: 'root'
})
export class AntologiaLeninService {

  constructor() { }
}
