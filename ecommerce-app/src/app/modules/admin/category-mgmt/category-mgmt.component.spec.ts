import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryMgmtComponent } from './category-mgmt.component';

describe('CategoryMgmtComponent', () => {
  let component: CategoryMgmtComponent;
  let fixture: ComponentFixture<CategoryMgmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryMgmtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
