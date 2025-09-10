import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../cart/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Orders } from '../../core/models/orders.interface';


@Component({
  selector: 'app-allorders',
  imports: [CommonModule, CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.css'
})
export class AllOrdersComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly toastr = inject(ToastrService);

  orders: Orders[] = [];
  isLoading: boolean = true;
  error: string = '';

  ngOnInit(): void {
    this.loadUserOrders();
  }
  loadUserOrders(): void {
    this.isLoading = true;
    this.cartService.getUserOrders().subscribe({
      next: (orders: Orders[]) => {
        this.orders = orders;
        this.toastr.success('Orders loaded successfully', 'FreshCart');
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading orders:', err);
        this.error = 'Error loading orders. Please try again.';
        this.toastr.error('Error loading orders', 'FreshCart');
        this.isLoading = false;
      }
    });
  }

  getOrderStatus(order: Orders): string {
    if (order.isDelivered) return 'Delivered';
    if (order.isPaid) return 'Processing';
    return 'Pending Payment';
  }

  getStatusClass(order: Orders): string {
    if (order.isDelivered) return 'bg-green-100 text-green-800';
    if (order.isPaid) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  }

  getPaymentMethodIcon(method: string): string {
    switch (method) {
      case 'card': return 'fab fa-cc-visa';
      case 'cash': return 'fas fa-money-bill-wave';
      default: return 'fas fa-credit-card';
    }
  }

  getPaymentMethodText(method: string): string {
    switch (method) {
      case 'card': return 'Credit Card';
      case 'cash': return 'Cash on Delivery';
      default: return method;
    }
  }

  getTotalItems(order: Orders): number {
    return order.cartItems.reduce((total, item) => total + item.count, 0);
  }
}
