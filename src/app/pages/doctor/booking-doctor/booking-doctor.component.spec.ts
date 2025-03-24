import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDoctorComponent } from './booking-doctor.component';

describe('BookingDoctorComponent', () => {
  let component: BookingDoctorComponent;
  let fixture: ComponentFixture<BookingDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingDoctorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
