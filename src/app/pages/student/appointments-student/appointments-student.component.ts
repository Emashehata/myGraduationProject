import { DoctorService } from './../../../core/services/doctor/doctor.service';
import { IDoctor } from '../../../core/interfaces/idoctor/idoctor';
import { IBookingPateint } from './../../../core/interfaces/IbookingPatient/ibooking-pateint';
import { BookingService } from './../../../core/services/booking/booking.service';
import { Component, inject, OnInit, WritableSignal, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IAvailableslots } from '../../../core/interfaces/IAvaliableslots/iavailableslots';
import { AppointmentsService } from '../../../core/services/appointments/appointments.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-appointments-student',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './appointments-student.component.html',
  styleUrl: './appointments-student.component.css'
})
export class AppointmentsStudentComponent implements OnInit{
  private readonly bookingService=inject(BookingService);
  private readonly doctorService=inject(DoctorService);
  private readonly appointmentsService=inject(AppointmentsService);
  private readonly toastrService = inject(ToastrService);
  private readonly formBuilder= inject(FormBuilder);
  patientBooking:WritableSignal<IBookingPateint[]>=signal([]);
  doctorAppointment:WritableSignal<IAvailableslots[]>=signal([]);
  updateBookingForm!:FormGroup;
  isLoading:boolean=false;
  ngOnInit(): void {
    this.getPatientAppointments();

    this.updateBookingForm=this.formBuilder.group({
      date:[''],
      time:[''],
      doctorId:['']
    })
  }

  getDoctorAvailableSlots(id:string):void{
    this.appointmentsService.getAvailableSlotsForDoctor(id).subscribe({
      next:(res)=>{
        console.log(res);
        if(res.success==true){
          this.doctorAppointment.set(res.data)
        }
        else{
          this.toastrService.error(res.message);
        }

      }
    })
  }
  fillAppointmentForm(booking: IBookingPateint) {
    this.updateBookingForm.patchValue({
      doctorId: booking.doctorId,
      date: booking.date,
      time: booking.time
    });
  }


  // onSubmitUpdateForm(bookingId: string): void {
  //   if (this.updateBookingForm.invalid) {
  //     this.toastrService.error('يرجى تعبئة جميع الحقول المطلوبة');
  //     return;
  //   }

  //   this.isLoading = true;

  //   this.bookingService.updateBooking(bookingId, this.updateBookingForm.value).subscribe({
  //     next: (res) => {
  //       if (res.success === true) {
  //         this.toastrService.success('تم تحديث الحجز بنجاح');
  //         this.getPatientAppointments(); // تحديث القائمة بعد الحفظ
  //       } else {
  //         this.toastrService.error(res.message);
  //       }
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       this.toastrService.error('حدث خطأ أثناء تحديث الحجز');
  //       this.isLoading = false;
  //     }
  //   });
  // }



  getPatientAppointments(){
    this.bookingService.getPatientBooking().subscribe({
      next:(res)=>{
        console.log(res);
        if(res.success==true){
          this.patientBooking.set(res.data);
        }
      }
    })
  }

  deleteSpecficBooking(id:string):void{
    this.bookingService.deleteBooking(id).subscribe({
      next:(res)=>{
        console.log(res);
        if(res.success==true){
          this.getPatientAppointments();
          this.toastrService.success(res.message);
        }

      },
      error:(err)=>{
        console.log(err);

      }
    })
  }


}
