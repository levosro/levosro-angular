import { Injector, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { BooksService } from './books.service';
import { HomepageComponent } from './homepage/homepage.component';
import { map } from 'rxjs/operators';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AllQuotesComponent } from './all-quotes/all-quotes.component';

const injector = Injector.create({
  providers: [{ provide: BooksService, useClass: BooksService, deps: [] }],
});
const booksService = injector.get(BooksService);

const initialRoutes: Routes = [
  ...booksService.getInitialLinks(),
  {
    path: '',
    component: HomepageComponent,
  },
  {
    path: 'citate',
    component: AllQuotesComponent,
  },
];

export function loadLinks(
  booksService: BooksService,
  router: Router
): () => Promise<void> {
  return () => {
    return new Promise((resolve) => {
      booksService
        .getLinks()
        .pipe(
          map((links) => {
            const updatedRoutes = initialRoutes.map((route) => {
              const updatedRoute = links.find(
                (link) => link.path === route.path
              );
              return updatedRoute || route;
            });
            router.resetConfig(updatedRoutes);
            // console.log(updatedRoutes);
          })
        )
        .subscribe(() => {
          resolve();
        });
    });
  };
}

@NgModule({
  imports: [RouterModule.forRoot(initialRoutes)],
  exports: [RouterModule],
  providers: [
    // {
    //   provide: LocationStrategy,
    //   useClass: HashLocationStrategy,
    // },
  ],
})
export class AppRoutingModule {
  constructor(private router: Router) {
    loadLinks(booksService, router)();
  }
}
