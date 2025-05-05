package com.ecommerce.backend.controller;
import com.ecommerce.backend.service.StripePaymentService;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private StripePaymentService stripePaymentService;

    @PostMapping("/create")
    public ResponseEntity<String> createPaymentIntent(@RequestParam long amount) {
        PaymentIntent intent = stripePaymentService.createPaymentIntent(amount, "usd");
        return ResponseEntity.ok(intent.getId()); // UI'ya PaymentIntentId dönebilirsin
    }

    @PostMapping("/refund")
    public ResponseEntity<String> refundPayment(@RequestParam String paymentIntentId) {
        stripePaymentService.refundPayment(paymentIntentId);
        return ResponseEntity.ok("Refund success");
    }
}
