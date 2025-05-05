package com.ecommerce.backend.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.RefundCreateParams;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StripePaymentService {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

   public Map<String, String> createPaymentIntent(long amount, String currency) {
    Stripe.apiKey = stripeSecretKey;

    PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
            .setAmount(amount)
            .setCurrency(currency)
            .build();

    try {
        PaymentIntent paymentIntent = PaymentIntent.create(params);

        Map<String, String> result = new HashMap<>();
        result.put("id", paymentIntent.getId());  // ✅ Refund için kullanılacak
        result.put("clientSecret", paymentIntent.getClientSecret()); // ✅ Angular için gerekli
        return result;

    } catch (StripeException e) {
        throw new RuntimeException("PaymentIntent oluşturulamadı: " + e.getMessage());
    }
}

    public void refundPayment(String paymentIntentId) {
        Stripe.apiKey = stripeSecretKey;

        try {
            Refund.create(RefundCreateParams.builder()
                    .setPaymentIntent(paymentIntentId)
                    .build());
        } catch (StripeException e) {
            throw new RuntimeException("Refund işlemi başarısız: " + e.getMessage());
        }
    }
       // ✅ Yeni method: KISMİ İADE
       public void partialRefund(String paymentIntentId, double refundAmount) {
        Stripe.apiKey = stripeSecretKey;

        try {
            long amountInSmallestUnit = Math.round(refundAmount * 100); // TRY/USD için kuruş/sent cinsine çevir

            RefundCreateParams params = RefundCreateParams.builder()
                    .setPaymentIntent(paymentIntentId)
                    .setAmount(amountInSmallestUnit)
                    .build();

            Refund.create(params);

        } catch (StripeException e) {
            throw new RuntimeException("Partial refund başarısız: " + e.getMessage());
        }
    }
}
