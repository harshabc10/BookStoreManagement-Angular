import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data-service/data.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  wishlistBooks: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist() {
    this.dataService.getWishlistBooks().subscribe((books) => {
      this.wishlistBooks = books;
    });
  }

  removeFromWishlist(bookId: number) {
    this.dataService.removeFromWishlist(bookId).subscribe(() => {
      this.loadWishlist();
    });
  }
}
