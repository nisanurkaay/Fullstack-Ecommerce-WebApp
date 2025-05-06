package com.ecommerce.backend.controller;
import com.ecommerce.backend.service.StripePaymentService;
import com.stripe.model.PaymentIntent;

import java.util.HashMap;
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
public Map<String, String> createPaymentIntent(@RequestParam long amount) {
    PaymentIntent intent = stripePaymentService.createPaymentIntent(amount, "try");

    Map<String, String> response = new HashMap<>();
    response.put("clientSecret", intent.getClientSecret());
    return response;
}


    @PostMapping("/refund")
    public ResponseEntity<String> refundPayment(@RequestParam String paymentIntentId) {
        stripePaymentService.refundPayment(paymentIntentId);
        return ResponseEntity.ok("Refund success");
    }
}
