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
    'https://via.placeholder.com/1200x500/FF5733/FFFFFF?text=Summer+Collection',
    'https://via.placeholder.com/1200x500/33A8FF/FFFFFF?text=Denim+Styles',
    'https://via.placeholder.com/1200x500/33FF57/FFFFFF?text=Tech+Gadgets'
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
