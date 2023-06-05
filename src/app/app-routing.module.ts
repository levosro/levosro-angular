import {
  APP_INITIALIZER,
  AfterViewInit,
  Injector,
  NgModule,
  OnInit,
  inject,
} from '@angular/core';
import {
  PreloadAllModules,
  Router,
  RouterModule,
  Routes,
} from '@angular/router';
import { BooksService } from './books.service';
import { HomepageComponent } from './homepage/homepage.component';
import { map } from 'rxjs/operators';
import { AllQuotesComponent } from './all-quotes/all-quotes.component';
import { Book } from './book';
import { Firestore } from '@angular/fire/firestore';

let initialRoutes: Routes = [
  // {
  //   path: '',
  //   component: HomepageComponent,
  // },
  // {
  //   path: 'citate',
  //   component: AllQuotesComponent,
  // },
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
  imports: [
    RouterModule.forRoot(initialRoutes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppCustomLogic,
      multi: true,
      deps: [Router, BooksService, Firestore],
    },
  ],
})
export class AppRoutingModule {}

export function initializeAppCustomLogic(
  router: Router,
  booksService: BooksService,
  firestore: Firestore
): () => Promise<void> {
  return () =>
    new Promise((resolve) => {
      booksService.getInitialLinks(firestore).subscribe((links) => {
        router.resetConfig([
          ...links,
          ...[
            {
              path: '',
              component: HomepageComponent,
            },
            {
              path: 'citate',
              component: AllQuotesComponent,
            },
          ],
        ]);
        if (links.length > 0) {
          resolve()
        }
      });
    });
}
