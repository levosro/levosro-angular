import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookPageComponent } from './book-page/book-page.component';
import { AppComponent } from './app.component';
import { BooksService } from './books.service';
import { HomepageComponent } from './homepage/homepage.component';
import { HttpClient } from '@angular/common/http';

const injector = Injector.create({
  providers: [{ provide: BooksService, useClass: BooksService, deps: [] }],
});
const booksService = injector.get(BooksService);

const routes: Routes = [
  {
    path: 'citate',
    component: HomepageComponent,
  },
  {
    path: '',
    component: HomepageComponent,
  },
];

function getPaths() {
  
}

export function loadLinks(booksService: BooksService): () => Promise<void> {
  return () => {
    return new Promise((resolve) => {
      booksService.getLinks().subscribe((links) => {
        links.forEach((element) => {
          if (!routes.includes(element)) {
            routes.push(element);
          }
        });
        console.log(routes);
        resolve();
      });
    });
  };
}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: loadLinks,
      deps: [BooksService],
      multi: true,
    },
  ],
})
export class AppRoutingModule {}
