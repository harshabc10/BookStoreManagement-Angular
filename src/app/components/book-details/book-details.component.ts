  import { Component, OnInit } from '@angular/core';
  import { ActivatedRoute, Route, Router } from '@angular/router';
  import { BookService } from 'src/app/services/book-service/book.service';
  import { DataService } from 'src/app/services/data-service/data.service';
  import { BookObj } from 'src/assets/booksInterface';

  @Component({
    selector: 'app-book-details',
    templateUrl: './book-details.component.html',
    styleUrls: ['./book-details.component.scss']
  })
  export class BookDetailsComponent implements OnInit {
    selectedBook!: BookObj;
    addedToBag: boolean = false;
    count: number = 1;
    addedToWishlist: boolean = false;
  

    constructor(private dataService: DataService, private route: ActivatedRoute, private bookService: BookService, private router :Router) {}

    ngOnInit(): void {
      this.dataService.currentBookList.subscribe(res1 => {
        this.route.params.subscribe(res2 => {
          const foundBook = res1.find(e => e.bookId == res2['bookId']);
          if (foundBook) {
            this.selectedBook = foundBook;
            this.checkIfBookInWishlist();
            this.dataService.getCartItems().subscribe(cartItems => {
              const item = cartItems.find(item => item.bookId === this.selectedBook.bookId);
              if (item) {
                this.addedToBag = true;
                this.count = item.quantity;
              }
            });
          } else {
            // Handle the case where the book is not found
            console.error('Book not found');
            this.router.navigate(['/error-page']); // or any appropriate action
          }
        });
      });

      if (localStorage.getItem('AuthToken')) {
        this.dataService.currCartList.subscribe((res: any) => {
          const result = res;
          for (let i = 0; i < result.length; i++) {
            if (result[i].bookId === this.selectedBook.bookId) {
              this.addedToBag = true;
              this.count = result[i].quantity;
            }
          }
        });
      }
    }

    addToBag() {
      this.addedToBag = true;
      this.dataService.addToCart(this.selectedBook, this.count);
      this.bookService.addBookToCart(this.selectedBook, this.count).subscribe(() => {
        console.log('Book added to cart successfully');
      });
    }

    increaseCount() {
      this.count++;
      if (this.addedToBag) {
        this.dataService.updateCartItemQuantity(this.selectedBook, this.count);
        this.bookService.updateBookQuantity(this.selectedBook, this.count).subscribe(() => {
          console.log('Book quantity updated successfully');
        });
      }
    }

    decreaseCount() {
      if (this.count > 1) {
        this.count--;
        if (this.addedToBag) {
          this.dataService.updateCartItemQuantity(this.selectedBook, this.count);
          this.bookService.updateBookQuantity(this.selectedBook, this.count).subscribe(() => {
            console.log('Book quantity updated successfully');
          });
        }
      }
    }
    addToWishlist() {
      this.addedToWishlist = true;
      if (localStorage.getItem('authToken')) {
          // Auth token is present, call addToWishlist from BookService
          this.bookService.addAllToWishlist(this.selectedBook).subscribe(() => {
              console.log('Book added to wishlist successfully');
              // Set the flag to true since the item is now in the wishlist
              this.bookService.getAllBooksWishlist().subscribe((wishlistBooks) => {
                  // Update your UI to display wishlistBooks
                  console.log('Wishlist books:', wishlistBooks);
                  // Example: this.wishlistBooks = wishlistBooks;
              });
            
          });
      } else {
          console.log('Auth token not present. Please log in.');
          this.dataService.updateWishlistBooks([this.selectedBook]);
        
      }
  }

  checkIfBookInWishlist() {
    if (localStorage.getItem('authToken')) {
      this.bookService.getAllBooksWishlist().subscribe((wishlistBooks) => {
        const bookInWishlist = wishlistBooks.data.some((book:any) => book.bookId === this.selectedBook.bookId);
        if (bookInWishlist) {
          this.addedToWishlist = true;
        }
      });
    } else {
      this.dataService.currWishlistBook.subscribe((wishlist) => {
        const bookInWishlist = wishlist.some(book => book.bookId === this.selectedBook.bookId);
        if (bookInWishlist) {
          this.addedToWishlist = true;
        }
      });
    }
  }

    
  }
    