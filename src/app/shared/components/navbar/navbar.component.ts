import { Component, Input, inject } from '@angular/core';
import { FlowbiteService } from '../../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';
import { CartService } from '../../../features/cart/services/cart.service';
import { Cart } from '../../../features/cart/models/cart.interface';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private flowbiteService: FlowbiteService) {}
  @Input({ required: true }) isLogin!: boolean;

  private readonly authService = new AuthService();
  private readonly cartService = inject(CartService);

  count: number = 0;

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite(() => {
      initFlowbite();
    });

    if (this.isLogin) {
      this.cartService.getLoggedUserCart().subscribe();

      this.cartService.cart$.subscribe((cart: Cart | null) => {
        this.count = cart ? cart.products.length : 0;
      });
    }
  }

  

  signOut(): void {
    this.authService.logout();
  }
}
