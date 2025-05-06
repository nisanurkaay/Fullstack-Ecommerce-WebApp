import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/models/cart-item.model';
import { OrderService } from '../../../core/services/order.service';
import { StripeService } from '../../../core/services/stripe.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: false
})
export class CheckoutComponent implements OnInit, AfterViewInit {
  cartItems: CartItem[] = [];
  totalAmount: number = 0;

  private stripe: Stripe | null = null;
  private elements!: StripeElements;
  private card!: StripeCardElement;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private stripeService: StripeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.totalAmount = this.calculateTotal();
    });
  }

  async ngAfterViewInit() {
    this.stripe = await loadStripe(environment.stripePublicKey);

    if (!this.stripe) throw new Error('Stripe yüklenemedi');

    this.elements = this.stripe.elements();
    this.card = this.elements.create('card');
    this.card.mount('#card-element');
  }

  calculateTotal(): number {
    return this.cartItems.reduce((sum, item) => {
      let price = item.product.price;

      if (item.variantId && item.product.variants) {
        const variant = item.product.variants.find(v => v.id === item.variantId);
        if (variant) price = variant.price;
      }

      return sum + price * item.quantity;
    }, 0);
  }

  async payWithStripe() {
    try {
      const amountInCents = Math.round(this.totalAmount * 100);

      if (amountInCents === 0) {
        alert("Sepet tutarı 0 olamaz.");
        return;
      }

      const clientSecret = await this.stripeService.createPaymentIntent(amountInCents);

      const result = await this.stripe!.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.card,
          billing_details: { name: 'Ad Soyad' }
        }
      });

      if (result.error) {
        alert('💳 Ödeme başarısız: ' + result.error.message);
      } else if (result.paymentIntent?.status === 'succeeded') {
        this.createOrder(clientSecret);
      }
    } catch (err) {
      console.error(err);
      alert('⚠️ Ödeme işlemi sırasında hata oluştu.');
    }
  }

  createOrder(paymentIntentId: string): void {
    console.log("Token var mı:", this.authService.getAccessToken());
    const orderPayload = {
      items: this.cartItems.map(item => ({
        productId: item.product.id,
        variantId: item.variantId,
        quantity: item.quantity
      })),
      paymentIntentId
    };

    console.log("📦 GÖNDERİLEN ORDER REQUEST:", JSON.stringify(orderPayload, null, 2));

    this.orderService.createOrderFromCart(this.cartItems, paymentIntentId).subscribe({
      next: () => {
        alert('🎉 Siparişiniz başarıyla oluşturuldu!');
        this.cartService.clearCart();
        this.router.navigate(['/orders']);
      },
      error: err => {
        console.error("❌ Backend Hatası:", err);
        alert('⚠️ Sipariş oluşturulamadı.');
      }
    });
  }
}
