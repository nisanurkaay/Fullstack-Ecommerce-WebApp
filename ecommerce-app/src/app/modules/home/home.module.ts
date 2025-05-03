import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { HeroCarouselComponent } from './components/hero-carousel/hero-carousel.component';
import { HomeRoutingModule } from './home-routing.module';
import { CategoryQuickLinksComponent } from './components/category-quick-links/category-quick-links.component';
import { BestSellersComponent } from './components/best-sellers/best-sellers.component';
import { SharedModule } from '../../shared/shared.module';
import { CategoryMenuComponent } from './components/category-menu/category-menu.component';

@NgModule({
  declarations: [
    HomeComponent,
    HeroCarouselComponent,
    CategoryQuickLinksComponent,
    BestSellersComponent,
    CategoryMenuComponent,

  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule
  ]
})
export class HomeModule { }
