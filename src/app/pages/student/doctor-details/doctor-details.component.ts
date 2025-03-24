import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DoctorService } from '../../../core/services/doctor/doctor.service';
import { IDoctor } from '../../../core/interfaces/idoctor/idoctor';
import { AppointmentsService } from '../../../core/services/appointments/appointments.service';
import { IAvailableslots } from '../../../core/interfaces/IAvaliableslots/iavailableslots';

@Component({
  selector: 'app-doctor-details',
  imports: [RouterLink],
  templateUrl: './doctor-details.component.html',
  styleUrl: './doctor-details.component.css'
})
export class DoctorDetailsComponent {
    private readonly activatedRoute=inject(ActivatedRoute);
    private readonly doctorService=inject(DoctorService);
    private readonly appointmentsService=inject(AppointmentsService);
    private readonly toastrService=inject(ToastrService);

    doctorData: WritableSignal<IDoctor | null> = signal(null);
    doctorAppointment:WritableSignal<IAvailableslots[]>=signal([]);

    ngOnInit(): void {


      this.activatedRoute.paramMap.subscribe({
        next:(params)=>{
          let doctorID =params.get('id');
          this.doctorService.getDoctorByID(doctorID!).subscribe({
            next:(res)=>{
              if(res.success==true){
                console.log(res);
                this.doctorData.set(res.data)
              }
              else{
                this.toastrService.error(res.message)
              }

            }
          })

          this.appointmentsService.getAvailableSlotsForDoctor(doctorID!).subscribe({
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
      })
    }

}
