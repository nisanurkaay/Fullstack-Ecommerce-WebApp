// src/app/modules/cart/checkout/checkout.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: false
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      fullName:    ['', Validators.required],
      address:     ['', Validators.required],
      city:        ['', Validators.required],
      zip:         ['', [Validators.required, Validators.pattern(/^[0-9]{5,}$/)]],
      cardNumber:  ['', [Validators.required, Validators.minLength(16)]],
      expiryMonth: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      expiryYear:  ['', [Validators.required, Validators.min(new Date().getFullYear())]],
      cvv:         ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
    });
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.orderService.createOrder(this.checkoutForm.value).subscribe({
      next: () => {
        // Ödeme onayı bildirimi
        window.alert('🎉 Ödemeniz onaylandı!');
        //  → Burayı /orders sayfasına yönlendirecek şekilde değiştirdik:
        this.router.navigate(['/orders']);
      },
      error: err => {
        console.error(err);
        window.alert('⚠️ Bir hata oluştu, lütfen tekrar deneyin.');
      }
    });
  }
}
