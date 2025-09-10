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

export const routes: Routes = [
      {path:'',redirectTo:'home',pathMatch:'full'},
      {path:'',component:AuthLayoutComponent,
            canActivate: [isLoggedGuard],
            children: [
                  {path:'login',component:LoginComponent,title:'Login'},
                  {path:'register',component:RegisterComponent,title:'Register'},
                  {path:'forget',component:ForgetPasswordComponent,title:'ForgetPassword'}
            ]
      },
      {path:'',component:BlankLayoutComponent,
            canActivate: [authGuard],
            children: [
                  {path:'home',component:HomeComponent,title:'Home Page'},
                  {path:'cart',component:CartComponent,title:'Cart Page'},
                  {path:'brands',component:BrandsComponent,title:'Brands Page'},
                  {path:'details/:id/:slug',component:DetailsComponent,title:'Details Page'},
                  {path:'details/:id',component:DetailsComponent,title:'Details Page'},
                  {path:'allorders',component:AllOrdersComponent,title:'All Orders Page'},
                  {path:'products',component:ProductsComponent,title:'Products Page'},
                  {path:'categories',component:CategoriesComponent,title:'Categories Page'},
                  {path:'checkout/:id',component:CheckoutComponent,title:'Checkout Page'}

            ]
      },
      {path:'**',component:NotfoundComponent,title:'Not Found'}
];
