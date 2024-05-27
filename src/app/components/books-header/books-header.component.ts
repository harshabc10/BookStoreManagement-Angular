import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SEARCH_ICON, PROFILE_ICON, CART_ICON } from 'src/assets/svg-icons';
import { LoginSignupComponent } from '../login-signup/login-signup.component';
import { BookService } from 'src/app/services/book-service/book.service';
import { HttpService } from 'src/app/services/http-service/http.service';
import { DataService } from 'src/app/services/data-service/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-books-header',
  templateUrl: './books-header.component.html',
  styleUrls: ['./books-header.component.scss']
})
export class BooksHeaderComponent implements OnInit {
  loginclick: boolean = false;
  searchString: string = '';
  isLoggedIn: boolean = false;

  constructor(
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private dialog: MatDialog,
    private dataService: DataService,
    private httpService: HttpService,
    private bookService: BookService,
    private router: Router
  ) {
    matIconRegistry.addSvgIconLiteral("search-icon", domSanitizer.bypassSecurityTrustHtml(SEARCH_ICON));
    matIconRegistry.addSvgIconLiteral("profile-icon", domSanitizer.bypassSecurityTrustHtml(PROFILE_ICON));
    matIconRegistry.addSvgIconLiteral("cart-icon", domSanitizer.bypassSecurityTrustHtml(CART_ICON));
  }

  ngOnInit(): void {
    this.isLoggedIn = this.checkLoginStatus();
    this.fetchBooks();
    this.fetchCartDetails();
    this.fetchWishlistBooks();
  }

  checkLoginStatus(): boolean {
    return !!localStorage.getItem('authToken');
  }

  fetchBooks() {
    this.httpService.getBooks().subscribe(res => this.dataService.changeState(res.data));
  }

  fetchCartDetails() {
    if (this.isLoggedIn) {
      this.bookService.getAllCartDetails().subscribe(res => this.dataService.setCartItems(res.data));
    } else {
      this.dataService.getCartItems().subscribe(cartItems => this.dataService.setCartItems(cartItems));
    }
  }

  fetchWishlistBooks() {
    if (this.isLoggedIn) {
      this.bookService.getAllBooksWishlist().subscribe(res => this.dataService.updateWishlistBooks(res.data));
    }
  }

  login() {
    const dialogRef = this.dialog.open(LoginSignupComponent, { width: '720px', height: '480px' });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result === true) { // Assuming result indicates successful login
        this.isLoggedIn = true;
        this.fetchCartDetails();
        this.fetchWishlistBooks();
      }
    });
    this.loginclick = !this.loginclick;
  }

  handelSerchString() {
    this.dataService.updateSearchString(this.searchString);
  }

  logOut() {
    localStorage.clear();
    this.isLoggedIn = false;
    this.router.navigate(['/dashboard/books']);
  }

  wishlist() {
    this.router.navigate(['/dashboard/wishlist']);
  }

  order() {
    if (this.isLoggedIn) {
      this.router.navigate(['/dashboard/orders']);
    } else {
      this.login();
    }
  }
}
