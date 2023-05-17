import { Chapter } from "./chapter";
import { Citat } from "./citat";
import { Note } from "./note";
import { Part } from "./part";
import { Text } from "./text";

export interface Book {
  title: string;
  author: string;
  cover: string;
  link: string;
  index: number;
  texts: Text[];
  chapters: Chapter[];
  parts: Part[];
  notes: Note[];
  citate: Citat[];
}
