import { ToastrService } from 'ngx-toastr';
import { IBookingDoctor } from '../../../core/interfaces/IBookingDoctor/ibooking-doctor';
import { BookingService } from './../../../core/services/booking/booking.service';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-booking-doctor',
  imports: [],
  templateUrl: './booking-doctor.component.html',
  styleUrl: './booking-doctor.component.css'
})
export class BookingDoctorComponent implements OnInit{
  private readonly bookingService=inject(BookingService);
  private readonly toastrService = inject(ToastrService);
  bookingDoctors:WritableSignal<IBookingDoctor[]>=signal([]);

  ngOnInit(): void {
    this.getDoctorsBooking();
  }

  getDoctorsBooking(){
    this.bookingService.getDoctorsBooking().subscribe({
      next:(res)=>{
        console.log(res);
        if(res.success==true){
          this.bookingDoctors.set(res.data);
        }

      }
    })
  }

  deleteSpecficBooking(id:string):void{
    this.bookingService.deleteBooking(id).subscribe({
      next:(res)=>{
        console.log(res);
        if(res.success==true){
          this.getDoctorsBooking();
          this.toastrService.success(res.message);
        }

      }
    })
  }
}
