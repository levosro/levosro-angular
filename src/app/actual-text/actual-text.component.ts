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
  safeContent!: SafeHtml[];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const oldContent = this.content;
    const newContent: SafeHtml[] = [];
    oldContent.forEach((cont) => {
      const newCont = this.sanitizer.bypassSecurityTrustHtml(cont);
      newContent.push(newCont);
    });
    this.safeContent = newContent;
  }
}
