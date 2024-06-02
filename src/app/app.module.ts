import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getStorage, provideStorage } from '@angular/fire/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SearchComponent } from './search/search.component';
import { BooksComponent } from './books/books.component';
import { BookComponent } from './book/book.component';
import { BookPageComponent } from './book-page/book-page.component';
import { ExpandedButtonComponent } from './expanded-button/expanded-button.component';
import { SearchContentComponent } from './search-content/search-content.component';
import { TextSearchContentComponent } from './text-search-content/text-search-content.component';
import { CitSearchContentComponent } from './cit-search-content/cit-search-content.component';
import { HomepageComponent } from './homepage/homepage.component';
import { HttpClientModule } from '@angular/common/http';
import { CenterComponent } from './center/center.component';
import { BookTocComponent } from './book-toc/book-toc.component';
import { BookContentComponent } from './book-content/book-content.component';
import { TextContentComponent } from './text-content/text-content.component';
import { BookButtonComponent } from './book-button/book-button.component';
import { ActualTextComponent } from './actual-text/actual-text.component';
import { QuotesComponent } from './quotes/quotes.component';
import { ButtonComponent } from './button/button.component';
import { AllQuotesComponent } from './all-quotes/all-quotes.component';
import { environment } from 'src/environments/environment';
import { SearchCitTextButtonComponent } from './search-cit-text-button/search-cit-text-button.component';
import { BookQuotesComponent } from './book-quotes/book-quotes.component';
import { ActualImageComponent } from './actual-image/actual-image.component';
import { provideFunctions } from '@angular/fire/functions';
import { getFunctions } from 'firebase/functions';
import { BookQuotesListComponent } from './book-quotes-list/book-quotes-list.component';
import { BookQuoteButtonComponent } from './book-quote-button/book-quote-button.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SearchComponent,
    BooksComponent,
    BookComponent,
    BookPageComponent,
    ExpandedButtonComponent,
    SearchContentComponent,
    TextSearchContentComponent,
    CitSearchContentComponent,
    HomepageComponent,
    CenterComponent,
    BookTocComponent,
    BookContentComponent,
    TextContentComponent,
    BookButtonComponent,
    ActualTextComponent,
    QuotesComponent,
    ButtonComponent,
    AllQuotesComponent,
    SearchCitTextButtonComponent,
    BookQuotesComponent,
    ActualImageComponent,
    BookQuotesListComponent,
    BookQuoteButtonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth()),
    provideFunctions(() => getFunctions()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
