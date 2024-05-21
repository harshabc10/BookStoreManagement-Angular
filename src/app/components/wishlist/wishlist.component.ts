import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BookService } from 'src/app/services/book-service/book.service';
import { DataService } from 'src/app/services/data-service/data.service';
import { BookObj } from 'src/assets/booksInterface';
import { DELETE_FOREVER_ICON } from 'src/assets/svg-icons';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  wishlistBooks: BookObj[] = [];

  constructor(private dataService: DataService, private bookService: BookService,  private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry, private cdr: ChangeDetectorRef) {
      matIconRegistry.addSvgIconLiteral("delete-icon", domSanitizer.bypassSecurityTrustHtml(DELETE_FOREVER_ICON))
    }

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist() {
    if (localStorage.getItem('authToken')) {
      this.bookService.getAllBooksWishlist().subscribe(
        (books) => {
          this.wishlistBooks = books.data;
          this.cdr.detectChanges();  // Trigger change detection
        },
        (error) => {
          console.error('Error fetching wishlist books:', error);
        }
      );
    } else {
      console.log('Auth token not present. Loading wishlist from local data.');
      this.dataService.currWishlistBook.subscribe((wishlist) => {
        console.log('Local wishlist:', wishlist);
        this.wishlistBooks = [...wishlist];
        this.cdr.detectChanges();  // Trigger change detection
      });
    }
  }
  removeFromWishlist(bookId: number) {
    if (localStorage.getItem('authToken')) {
      this.bookService.deleteFromWishlist(bookId).subscribe(
        () => {
          console.log('Book removed from wishlist.');
          // Update the wishlist by filtering out the removed book
          this.wishlistBooks = this.wishlistBooks.filter(book => book.bookId !== bookId);
          this.cdr.detectChanges();  // Trigger change detection
        },
        (error) => {
          console.error('Error removing book from wishlist:', error);
        }
      );
    } else {
      console.log('Auth token not present. Removing book from UI.');
      // Remove the book from UI without making a server call
      this.wishlistBooks = this.wishlistBooks.filter(book => book.bookId !== bookId);
      // this.dataService.updateWishlistBooks(this.wishlistBooks); // Update DataService to reflect changes
      this.cdr.detectChanges();  // Trigger change detection
    }
  }
}
