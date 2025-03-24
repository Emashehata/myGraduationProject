import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppointmentsService } from '../../../core/services/appointments/appointments.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { IAppointment } from '../../../core/interfaces/Iappointment/iappointment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-appointments-doctor',
  imports: [ReactiveFormsModule,DatePipe],
  templateUrl: './appointments-doctor.component.html',
  styleUrl: './appointments-doctor.component.css'
})
export class AppointmentsDoctorComponent implements OnInit{

  private readonly formBuilder= inject(FormBuilder);
  private readonly toastrService = inject(ToastrService);
  private readonly appointmentsService=inject(AppointmentsService);
  appointmentsData: WritableSignal<IAppointment[]> = signal([]);
  isLoading:boolean=false;

  addAppointmentForm!:FormGroup;
  updateAppointmentForm!:FormGroup;
  ngOnInit(): void {
    this.addAppointmentForm=this.formBuilder.group({
      day:['',[Validators.required]],
      startTime:[null,[Validators.required]],
      endTime:[null,[Validators.required]],
      duration:[null,[Validators.required]]
    });
    this.updateAppointmentForm=this.formBuilder.group({
      day:[null],
      startTime:[''],
      endTime:[''],
      duration:[null]
    });

    this.getDoctorsAppointments();
  }


  submitAddAppointmentForm(): void {
    if (this.addAppointmentForm.valid) {
      this.isLoading = true;

      // Convert values to match API expectations
      const appointmentData = {
        day: Number(this.addAppointmentForm.get('day')?.value), // Ensure it's a number
        startTime: this.addAppointmentForm.get('startTime')?.value,
        endTime: this.addAppointmentForm.get('endTime')?.value,
        duration: Number(this.addAppointmentForm.get('duration')?.value) // Ensure duration is a number
      };

      this.appointmentsService.createAppointment(appointmentData).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: (res) => {
          console.log(res);
          if (res.success) {
            setTimeout(() => {
              this.toastrService.success(res.message);
              this.getDoctorsAppointments();
            }, 400);
          }
        }
      });

    } else {
      this.addAppointmentForm.markAllAsTouched();
    }
  }


  getDoctorsAppointments():void{
    this.appointmentsService.getDoctorAppointments().subscribe({
      next:(res)=>{
        console.log(res);
        if(res.success==true){
          this.appointmentsData.set(res.data);
        }


      }
    })
  }

  deleteSpecficAppointment(id:string):void{
    this.appointmentsService.deleteAppointment(id).subscribe({
      next:(res)=>{
        console.log(res);
        if(res.success==true){
          this.getDoctorsAppointments();
          this.toastrService.success(res.message);
        }

      }
    })
  }


  submitUpdateAppointment(id: string): void {
    if (this.updateAppointmentForm.valid) {
      this.isLoading = true;

      // Prepare the updated appointment data
      const appointmentData: any = {};
      const formControls = this.updateAppointmentForm.controls;

      // Only add properties if they are provided by the user
      if (formControls['day'].value) {
        appointmentData.day = Number(formControls['day'].value);
      }
      if (formControls['startTime'].value) {
        appointmentData.startTime = formControls['startTime'].value;
      }
      if (formControls['endTime'].value) {
        appointmentData.endTime = formControls['endTime'].value;
      }
      if (formControls['duration'].value) {
        appointmentData.duration = Number(formControls['duration'].value);
      }

      console.log('Updating Data:', appointmentData); // Debugging

      this.appointmentsService.UpdateAppointment(appointmentData, id).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: (res) => {
          console.log(res);
          setTimeout(() => {
            this.toastrService.success(res.message);
            this.getDoctorsAppointments();
          }, 400);
        },
        error: (err) => {
          console.error("Error:", err);
        }
      });

    } else {
      this.updateAppointmentForm.markAllAsTouched();
    }
  }




  patchValue(appointment:any):void{
    this.updateAppointmentForm.patchValue(appointment);
  }


  daysOfWeek = [
    { label: 'الأحد', value: 0 },
    { label: 'الاثنين', value: 1 },
    { label: 'الثلاثاء', value: 2 },
    { label: 'الأربعاء', value: 3 },
    { label: 'الخميس', value: 4 },
    { label: 'الجمعة', value: 5 },
    { label: 'السبت', value: 6 }
  ];


}
