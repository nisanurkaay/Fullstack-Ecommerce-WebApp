import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryQuickLinksComponent } from './category-quick-links.component';

describe('CategoryQuickLinksComponent', () => {
  let component: CategoryQuickLinksComponent;
  let fixture: ComponentFixture<CategoryQuickLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryQuickLinksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryQuickLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
