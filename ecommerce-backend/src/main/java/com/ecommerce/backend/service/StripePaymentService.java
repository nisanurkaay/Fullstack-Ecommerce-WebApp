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
            throw new RuntimeException("PaymentIntent oluşturulamadı: " + e.getMessage());
        }
    }

    public void refundPayment(String paymentIntentId) {
        Stripe.apiKey = stripeSecretKey;
        validateIntentId(paymentIntentId);

        try {
            Refund.create(RefundCreateParams.builder()
                    .setPaymentIntent(paymentIntentId)
                    .build());
        } catch (StripeException e) {
            throw new RuntimeException("Refund işlemi başarısız: " + e.getMessage());
        }
    }

   

    private void validateIntentId(String id) {
        if (id.contains("_secret_")) {
            throw new RuntimeException("Geçersiz PaymentIntent ID. Lütfen sadece pi_... formatındaki ID gönderin.");
        }
    }
}