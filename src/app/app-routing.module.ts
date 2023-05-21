import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookPageComponent } from './book-page/book-page.component';
import { AppComponent } from './app.component';
import { BooksService } from './books.service';
import { HomepageComponent } from './homepage/homepage.component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const injector = Injector.create({
  providers: [{ provide: BooksService, useClass: BooksService, deps: [] }],
});
const booksService = injector.get(BooksService);

var routes: Routes = [
  ...booksService.getInitialLinks(),
  {
    path: 'citate',
    component: HomepageComponent,
  },
  {
    path: '',
    component: HomepageComponent,
  },
];

export function loadLinks(booksService: BooksService): () => Promise<void> {
  return () => {
    return new Promise((resolve) => {
      booksService
        .getLinks()
        .pipe(
          map((links) => {
            links.forEach((element) => {
              const path = element.path
              const route = routes.filter(item => item.path == path)[0]
              const index = routes.indexOf(route)
              routes[index] = element
            });
            console.log(routes);
          })
        )
        .subscribe(() => {
          resolve();
        });
    });
  };
}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: () => loadLinks,
    //   deps: [BooksService],
    //   multi: true,
    // },
  ],
})
export class AppRoutingModule {}
