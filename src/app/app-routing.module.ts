import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksContainerComponent } from './components/books-container/books-container.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';

const routes: Routes = [
  {
    path:'dashboard',
    component:DashboardComponent,
    children:[
     {
      path:'books',
      component:BooksContainerComponent
    },
     {
      path:'bookdetails',
     component:BookDetailsComponent
    },
  {
    path:'cart',
    component:CartDetailsComponent
  }]
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
