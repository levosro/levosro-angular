import { Component, Input, OnInit, inject } from '@angular/core';
import { Book } from '../book';
import { Router } from '@angular/router';
import { Storage, getDownloadURL, ref } from '@angular/fire/storage';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
})
export class BookComponent implements OnInit {
  @Input() book!: Book;
  storage: Storage = inject(Storage);

  imageUrl!: string;

  async ngOnInit() {
    this.imageUrl = await this.getImageUrl();
  }

  constructor(private router: Router) {}
  onNavigate() {
    this.router.navigate([this.book.link]);
  }

  async getImageUrl() {
    const storageRef = ref(this.storage, this.book.link + '-bcover');
    const url = await getDownloadURL(storageRef);
    return url;
  }
}
