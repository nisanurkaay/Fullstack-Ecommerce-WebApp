package com.ecommerce.backend.controller;
import com.ecommerce.backend.service.StripePaymentService;
import com.stripe.model.PaymentIntent;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private StripePaymentService stripePaymentService;

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createPaymentIntent(@RequestParam long amount) {
        Map<String, String> paymentIntent = stripePaymentService.createPaymentIntent(amount, "try");
        return ResponseEntity.ok(paymentIntent); // id ve clientSecret birlikte döner
    }
    

    @PostMapping("/refund")
    public ResponseEntity<String> refundPayment(@RequestParam String paymentIntentId) {
        stripePaymentService.refundPayment(paymentIntentId);
        return ResponseEntity.ok("Refund success");
    }
}
