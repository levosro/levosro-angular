import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements AfterViewInit {
  ngAfterViewInit() {
    addContent();
  }
  openNav() {
    document.getElementById('sidenav')!.style.display = 'block';
    document.getElementById('sidenav')!.style.width = '200px';
    (document.querySelector('.main') as HTMLElement).style.marginLeft = '200px';
  }

  closeNav() {
    document.getElementById('sidenav')!.style.display = 'none';
    document.getElementById('sidenav')!.style.width = '0';
    (document.querySelector('.main') as HTMLElement).style.marginLeft = '0';
  }
}

function addContent() {
  document.getElementById('quotes')!.addEventListener('click', function () {
    window.location.href = './citate';
  });
  document.getElementById('youtube')!.addEventListener('click', function () {
    window.open('https://www.youtube.com/@levos4355', '_blank')!.focus();
  });
  document.getElementById('instagram')!.addEventListener('click', function () {
    window.open('https://www.instagram.com/levosro/', '_blank')!.focus();
  });
  document.getElementById('facebook')!.addEventListener('click', function () {
    window.open('https://www.facebook.com/rolevos', '_blank')!.focus();
  });
  document.getElementById('discord')!.addEventListener('click', function () {
    window.open('https://discord.gg/dQY44b7T', '_blank')!.focus();
  });
}
