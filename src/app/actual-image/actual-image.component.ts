import { Component, Input, OnInit, inject } from '@angular/core';
import { Storage, getDownloadURL, ref } from '@angular/fire/storage';

@Component({
  selector: 'app-actual-image',
  templateUrl: './actual-image.component.html',
  styleUrls: ['./actual-image.component.css']
})
export class ActualImageComponent implements OnInit {
  @Input() alt!: string;
  @Input() link!: string;
  src!: Promise<string>;
  storage: Storage = inject(Storage);

  ngOnInit(): void {
    // this.alt = this.alt.split('.png')[0]
    this.src = this.getImageUrl(this.alt);
  }

  async getImageUrl(name: string) {
    const storageRef = ref(this.storage, `${this.link}/${name}`);
    const url = await getDownloadURL(storageRef);
    console.log(url)
    return url;
  }
}