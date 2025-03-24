import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor/doctor.service';
import { ToastrService } from 'ngx-toastr';
import { IDoctor } from '../../../core/interfaces/idoctor/idoctor';
import { IClinic } from '../../../core/interfaces/Iclinic/iclinic';
import { ClinicsService } from '../../../core/services/clinics/clinics.service';

@Component({
  selector: 'app-doctors',
  imports: [RouterLink],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class DoctorsComponent implements OnInit {

  readonly doctorService=inject(DoctorService);
  private readonly toastrService = inject(ToastrService);
  readonly clinicsService = inject(ClinicsService);


  ngOnInit(): void {
    this.doctorService.getDoctorsData();
    this.clinicsService.getClinicsData();
  }




  deleteDoctor(id:string):void{
    this.doctorService.deleteDoctorByID(id).subscribe({
      next:(res)=>{
        console.log(res);
        if(res.success==true){
          this.doctorService.getDoctorsData();
          this.toastrService.success('تم حذف الطبيب بنجاح.')

        }

      }
    })
  }




}
