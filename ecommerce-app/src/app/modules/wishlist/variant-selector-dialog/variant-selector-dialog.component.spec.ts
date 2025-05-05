import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantSelectorDialogComponent } from './variant-selector-dialog.component';

describe('VariantSelectorDialogComponent', () => {
  let component: VariantSelectorDialogComponent;
  let fixture: ComponentFixture<VariantSelectorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VariantSelectorDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariantSelectorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
