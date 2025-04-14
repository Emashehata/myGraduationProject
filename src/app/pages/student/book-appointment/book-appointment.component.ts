import { BookingService } from './../../../core/services/booking/booking.service';
 import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppointmentsService } from '../../../core/services/appointments/appointments.service';
import { DoctorService } from '../../../core/services/doctor/doctor.service';
import { IAvailableslots } from '../../../core/interfaces/IAvaliableslots/iavailableslots';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-book-appointment',
  imports: [ReactiveFormsModule],
  templateUrl: './book-appointment.component.html',
  styleUrl: './book-appointment.component.css'
})
export class BookAppointmentComponent {
  private readonly formBuilder= inject(FormBuilder);
  private readonly toastrService = inject(ToastrService);
  private readonly appointmentsService=inject(AppointmentsService);
  private readonly bookingService=inject(BookingService);
  private readonly activatedRoute=inject(ActivatedRoute);
  private readonly router=inject(Router);
  readonly doctorService=inject(DoctorService);
  doctorAppointment:WritableSignal<IAvailableslots[]>=signal([]);
  isLoading:boolean=false;
  addBookingForm!:FormGroup;

   ngOnInit(): void {

    this.doctorService.getDoctorsData();
      this.addBookingForm=this.formBuilder.group({
        date:['',[Validators.required]],
        time:['',[Validators.required]],
        doctorId:['',[Validators.required]]
      });

      this.activatedRoute.paramMap.subscribe({
        next:(params)=>{
          let doctorID =params.get('id');
          if (doctorID) {
            this.addBookingForm.patchValue({ doctorId: doctorID }); // Set the selected doctor
            this.getDoctorAvailableSlots(doctorID);
          }
        }
      })

      this.addBookingForm.get('doctorId')?.valueChanges.subscribe(doctorId => {
        if (doctorId) {
          this.getDoctorAvailableSlots(doctorId);
        }
      });
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

    sumbitBookingForm():void{
        if(this.addBookingForm.valid){
          this.isLoading=true;
          this.bookingService.createBooking(this.addBookingForm.value).pipe(finalize(() => this.isLoading = false)).subscribe({
            next: (res) => {
              console.log(res);
                if(res.success==true){
                  setTimeout(() => {
                    this.toastrService.success(res.message);
                    this.router.navigate(['/home']);
                  }, 500);
                }


              this.isLoading=false;
            },
            error:(err)=>{
              this.toastrService.error(err.error.message)
            }
          })
        }
        else{
          this.addBookingForm.markAllAsTouched();
        }

      }
}

