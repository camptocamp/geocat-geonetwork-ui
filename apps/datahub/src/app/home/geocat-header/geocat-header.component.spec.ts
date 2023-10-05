import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeocatHeaderComponent } from './geocat-header.component';

describe('GeocatHeaderComponent', () => {
  let component: GeocatHeaderComponent;
  let fixture: ComponentFixture<GeocatHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeocatHeaderComponent]
    });
    fixture = TestBed.createComponent(GeocatHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
