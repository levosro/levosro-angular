import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Book } from '../book';

@Component({
  selector: 'app-actual-text',
  templateUrl: './actual-text.component.html',
  styleUrls: ['./actual-text.component.css'],
})
export class ActualTextComponent implements OnInit {
  @Input() content!: string[];
  @Input() book!: Book;
  safeContent!: SafeHtml[];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const oldContent = this.content;
    const procContent: string[] = []
    oldContent.forEach(item => procContent.push(this.process(item)))
    const newContent: SafeHtml[] = [];
    procContent.forEach((cont) => {
      const newCont = this.sanitizer.bypassSecurityTrustHtml(cont);
      newContent.push(newCont);
    });
    this.safeContent = newContent;
  }

  process(content: string) {
    if (content.includes('<img')) {
      console.log(content)
      return `<div style="text-align: center;">${content.replace('./Images', `assets/content/${this.book.link}/Images`)}</div>`
    }
    else return content
  }
}
