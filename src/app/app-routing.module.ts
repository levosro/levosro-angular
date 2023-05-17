import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookPageComponent } from './book-page/book-page.component';
import { AppComponent } from './app.component';
import { BooksService } from './books.service';
import { HomepageComponent } from './homepage/homepage.component';

const routes: Routes = [
  ...BooksService.getLinks(),
  {
    path: 'citate',
    component: HomepageComponent,
  },
  {
    path: '',
    component: HomepageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
