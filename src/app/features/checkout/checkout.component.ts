import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InputComponent } from "../../shared/components/input/input.component";
import { CartService } from '../cart/services/cart.service';
import { Cart, Product } from '../cart/models/cart.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, CommonModule, InputComponent, CurrencyPipe, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly toasterServices = inject(ToastrService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  checkoutForm!: FormGroup;
  cartData: Cart = {} as Cart;
  isLoading: boolean = true;
  isProcessingVisa: boolean = false;
  cartId!: string;

  ngOnInit(): void {
    this.getCartIdFromRoute();
    this.initForm();
  }

  getCartIdFromRoute(): void {
    this.cartId = this.route.snapshot.paramMap.get('id') || '';
    if (this.cartId) {
      this.getCartData(this.cartId);
    } else {
      this.toasterServices.error('Invalid cart ID', 'FreshCart');
      this.router.navigate(['/cart']);
    }
  }

  initForm(): void {
    this.checkoutForm = this.fb.group({
      shippingAddress: this.fb.group({
        details: [null, [Validators.required]],
        phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
        city: [null, [Validators.required]],
      }),
    });
  }

  getCartData(cartId: string): void {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        console.log('Cart data:', res.data);
        this.cartData = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.log('Error fetching cart:', err);
        this.isLoading = false;
        this.toasterServices.error('Failed to load cart data', 'FreshCart');
      }
    });
  }

  getControl(path: string): FormControl | null {
    const control = this.checkoutForm.get(path);
    return control instanceof FormControl ? control : null;
  }

  payWithCash(): void {
    if (this.checkoutForm.valid && this.hasProducts()) {
      const orderData = {
        shippingAddress: this.checkoutForm.value.shippingAddress
      };
      
      console.log('Cash payment submitted:', orderData);
      this.processCashPayment(orderData);
    } else {
      this.handleFormErrors();
    }
  }

  payWithVisa(): void {
    if (this.checkoutForm.valid && this.hasProducts()) {
      const paymentData = {
        shippingAddress: this.checkoutForm.value.shippingAddress
      };
      
      console.log('Visa payment initiated:', paymentData);
      this.processVisaPayment(paymentData);
    } else {
      this.handleFormErrors();
    }
  }

  processCashPayment(orderData: any): void {
    // Your cash payment logic here
    this.cartService.checkOutCash(this.cartId, orderData).subscribe({
      next: (res) => {
        console.log('Cash payment response:', res);
        this.toasterServices.success('Order placed successfully!', 'FreshCart');
        this.router.navigate(['/allorders']);
      },
      error: (err) => {
        console.error('Cash payment error:', err);
        this.toasterServices.error('Payment failed', 'FreshCart');
      }
    });
  }

  processVisaPayment(paymentData: any): void {
    this.isProcessingVisa = true;
    this.cartService.checkOutSession(this.cartId, paymentData).subscribe({
      next: (res) => {
        console.log('Visa payment response:', res);
        this.isProcessingVisa = false;
        
        if (res.status === 'success' ) {
          // Redirect to the payment gateway
          window.open(res.session.url, '_self');
        } else {
          this.toasterServices.error('Invalid payment session response', 'FreshCart');
        }
      },
      error: (err) => {
        console.error('Visa payment error:', err);
        this.isProcessingVisa = false;
        this.toasterServices.error('Payment initialization failed', 'FreshCart');
      }
    });
  }

  handleFormErrors(): void {
    this.checkoutForm.markAllAsTouched();
    if (!this.hasProducts()) {
      this.toasterServices.error('Your cart is empty', 'FreshCart');
    } else {
      this.toasterServices.error('Please fill all required fields', 'FreshCart');
    }
  }

  calculateSubtotal(): number {
    return this.cartData.totalCartPrice || 0;
  }

  

  hasProducts(): boolean {
    return this.cartData.products && this.cartData.products.length > 0;
  }

  getTotalItems(): number {
    if (this.cartData.products && this.cartData.products.length > 0) {
      return this.cartData.products.reduce((total, product) => total + product.count, 0);
    }
    return 0;
  }
}