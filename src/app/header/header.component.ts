import { AfterViewInit, Component, Input } from '@angular/core';
import { Book } from '../book';

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
  Array.from(document.getElementsByClassName('fa-quote-right')).forEach((element) => {
    element.addEventListener('click', function () {
      window.location.href = './citate';
    });
  });


  Array.from(document.getElementsByClassName('fa-youtube')).forEach((element) => {
    element.addEventListener('click', function () {
      window.open('https://www.youtube.com/@levos4355', '_blank')!.focus();
    });
  });


  Array.from(document.getElementsByClassName('fa-instagram')).forEach((element) => {
    element.addEventListener('click', function () {
      window.open('https://www.instagram.com/levosro/', '_blank')!.focus();
    });
  });


  Array.from(document.getElementsByClassName('fa-facebook')).forEach((element) => {
    element.addEventListener('click', function () {
      window.open('https://www.facebook.com/rolevos', '_blank')!.focus();
    });
  });


  // document.getElementById('discord')!.addEventListener('click', function () {
  //   window.open('https://discord.gg/dQY44b7T', '_blank')!.focus();
  // });
}
