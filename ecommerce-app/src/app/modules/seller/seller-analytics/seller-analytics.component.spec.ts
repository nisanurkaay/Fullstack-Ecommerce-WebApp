import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerAnalyticsComponent } from './seller-analytics.component';

describe('SellerAnalyticsComponent', () => {
  let component: SellerAnalyticsComponent;
  let fixture: ComponentFixture<SellerAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SellerAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
