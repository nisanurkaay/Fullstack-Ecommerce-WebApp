package com.ecommerce.backend.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.RefundCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
@Service
public class StripePaymentService {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    public PaymentIntent createPaymentIntent(long amount, String currency) {
        Stripe.apiKey = stripeSecretKey;

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
            .setAmount(amount)
            .setCurrency(currency)
            .build();

        try {
            return PaymentIntent.create(params);
        } catch (StripeException e) {
            throw new RuntimeException("PaymentIntent oluşturulamadı: " + e.getMessage(), e);
        }
    }

    /** Tam iade (kuruş girmeye gerek yok) */
    public Refund refundPayment(String paymentIntentId) {
        Stripe.apiKey = stripeSecretKey;
        String pi = cleanIntentId(paymentIntentId);

        try {
            RefundCreateParams params = RefundCreateParams.builder()
                .setPaymentIntent(pi)
                .build();
            return Refund.create(params);
        } catch (StripeException e) {
            throw new RuntimeException("Stripe full refund failed: " + e.getMessage(), e);
        }
    }

  /** Kısmi iade: amountCents kuruş cinsinden */
  public Refund refundPayment(String paymentIntentId, long amountCents) {
    Stripe.apiKey = stripeSecretKey;
    String pi = cleanIntentId(paymentIntentId);

    try {
      RefundCreateParams params = RefundCreateParams.builder()
          .setPaymentIntent(pi)
          .setAmount(amountCents)
          .build();
      return Refund.create(params);
    } catch (StripeException e) {
      throw new RuntimeException("Stripe partial refund failed: " + e.getMessage(), e);
    }
  }

  private String cleanIntentId(String full) {
    int idx = full.indexOf("_secret_");
    return idx>0 ? full.substring(0,idx) : full;
  }
}
