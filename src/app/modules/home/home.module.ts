import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { HeroCarouselComponent } from './components/hero-carousel/hero-carousel.component';
import { HomeRoutingModule } from './home-routing.module';
import { CategoryQuickLinksComponent } from './components/category-quick-links/category-quick-links.component';
import { BestSellersComponent } from './components/best-sellers/best-sellers.component';


@NgModule({
  declarations: [
    HomeComponent,
    HeroCarouselComponent,
    CategoryQuickLinksComponent,
    BestSellersComponent,

  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
