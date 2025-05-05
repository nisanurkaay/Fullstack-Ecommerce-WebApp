import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hero-carousel',
  standalone: false,
  templateUrl: './hero-carousel.component.html',
  styleUrls: ['./hero-carousel.component.css']
})
export class HeroCarouselComponent implements OnInit {
  currentSlide = 0;
  slides = [
    'assets/summer24.jpg',
    'assets/denim.jpg',
    'assets/tech.jpg'
  ];

  ngOnInit(): void {
    setInterval(() => this.nextSlide(), 4000);
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }
}
