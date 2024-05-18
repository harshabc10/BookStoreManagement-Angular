import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksContainerComponent } from './components/books-container/books-container.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginSignupComponent } from './components/login-signup/login-signup.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';

const routes: Routes = [
  {
    path:'login',
    component:LoginComponent

  },
  {
    path:'signUp',
    component:SignupComponent

  },
  {
    path:'loginSignUp',
    component:LoginSignupComponent

  },
  {
    path:'customer',
    component:CustomerDetailsComponent
  },

  {
    path:'dashboard',
    component:DashboardComponent,
    children:[
     {
      path:'books',
      component:BooksContainerComponent
    },
     {
      path:'bookdetails/:bookId',
     component:BookDetailsComponent
    },

  {
    path:'cart',
    component:CartDetailsComponent
  },
  {
    path:'wishlist',
    component:WishlistComponent

  },]
    },
    {
      path:"rrr",
      component:BookDetailsComponent
    }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
