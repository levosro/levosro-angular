import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
