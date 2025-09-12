import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layout/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './core/layout/blank-layout/blank-layout.component';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';   
import { BrandsComponent } from './features/brands/brands.component';
import { DetailsComponent } from './features/details/details.component';
import { ProductsComponent } from './features/products/products.component';
import { NotfoundComponent } from './features/notfound/notfound.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { authGuard } from './core/guards/auth-guard';
import { isLoggedGuard } from './core/guards/is-logged-guard';
import { AllOrdersComponent } from './features/allorders/allorders.component';
import { ForgetPasswordComponent } from './core/auth/forget-password/forget-password.component';
import { CategoryProductsComponent } from './features/categories/categoryproducts/categoryproducts.component';
import { WishlistComponent } from './features/wishlist/wishlist.component';
import { ProfileComponent } from './features/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [isLoggedGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./core/auth/login/login.component').then(m => m.LoginComponent),
        title: 'Login'
      },
      {
        path: 'register',
        loadComponent: () => import('./core/auth/register/register.component').then(m => m.RegisterComponent),
        title: 'Register'
      },
      {
        path: 'forget',
        loadComponent: () => import('./core/auth/forget-password/forget-password.component').then(m => m.ForgetPasswordComponent),
        title: 'ForgetPassword'
      }
    ]
  },

  {
    path: '',
    component: BlankLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
        title: 'Home Page'
      },
      {
        path: 'cart',
        loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent),
        title: 'Cart Page'
      },
      {
        path: 'wishlist',
        loadComponent: () => import('./features/wishlist/wishlist.component').then(m => m.WishlistComponent),
        title: 'WishList Page'
      },
      {
        path: 'brands',
        loadComponent: () => import('./features/brands/brands.component').then(m => m.BrandsComponent),
        title: 'Brands Page'
      },
      {
        path: 'details/:id/:slug',
        loadComponent: () => import('./features/details/details.component').then(m => m.DetailsComponent),
        title: 'Details Page',
        data: { renderMode: 'server' }
      },
      {
        path: 'details/:id',
        loadComponent: () => import('./features/details/details.component').then(m => m.DetailsComponent),
        title: 'Details Page',
        data: { renderMode: 'server' }
      },
      {
        path: 'allorders',
        loadComponent: () => import('./features/allorders/allorders.component').then(m => m.AllOrdersComponent),
        title: 'All Orders Page'
      },
      {
        path: 'products',
        loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent),
        title: 'Products Page'
      },
      {
        path: 'categories',
        loadComponent: () => import('./features/categories/categories.component').then(m => m.CategoriesComponent),
        title: 'Categories Page'
      },
      {
        path: 'categories/:id',
        loadComponent: () => import('./features/categories/categoryproducts/categoryproducts.component').then(m => m.CategoryProductsComponent),
        title: 'Category Products Page',
        data: { renderMode: 'server' }
      },
      {
        path: 'checkout/:id',
        loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent),
        title: 'Checkout Page',
        data: { renderMode: 'server' }
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
        title: 'Profile Page'
      }
    ]
  },

  {
    path: '**',
    loadComponent: () => import('./features/notfound/notfound.component').then(m => m.NotfoundComponent),
    title: 'Not Found'
  }
];
