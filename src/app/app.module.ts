import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BooksHeaderComponent } from './components/books-header/books-header.component';
import { BooksContainerComponent } from './components/books-container/books-container.component';
import { BookComponent } from './components/book/book.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { LoginSignupComponent } from './components/login-signup/login-signup.component';
import { MatMenuModule } from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import { SearchPipe } from './services/pipe/search.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { MyOrderComponent } from './components/my-order/my-order.component'; // Import these modules




@NgModule({
  declarations: [
    AppComponent,
    BooksHeaderComponent,
    BooksContainerComponent,
    BookComponent,
    DashboardComponent,
    BookDetailsComponent,
    CartDetailsComponent,
    LoginComponent,
    SignupComponent,
    LoginSignupComponent,
    SearchPipe,
    CustomerDetailsComponent,
    WishlistComponent,
    OrderDetailsComponent,
    MyOrderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    FormsModule, // Include FormsModule here
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatDialogModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
