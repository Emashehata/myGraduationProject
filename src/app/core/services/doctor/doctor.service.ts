import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IDoctor } from '../../interfaces/idoctor/idoctor';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private httpClient:HttpClient) {}

  doctorImg:BehaviorSubject<string> = new BehaviorSubject('');
  firstName:BehaviorSubject<string> = new BehaviorSubject('');
  lastName:BehaviorSubject<string> = new BehaviorSubject('');
  doctorsData: WritableSignal<IDoctor[]> = signal([]);
  private readonly toastrService = inject(ToastrService);

  getAllDoctors():Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}api/Doctor`);
  }


  getDoctorByID(id:string):Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}api/Doctor/${id}`);
  }


  getDoctorByClinicID(clinicID:string):Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}api/Doctor/by-clinic/${clinicID}`);
  }


  deleteDoctorByID(id:string):Observable<any>{
    return this.httpClient.delete(`${environment.baseUrl}api/Doctor/${id}`);
  }


  updateDoctorUsingToken(data:object):Observable<any>{
    return this.httpClient.put(`${environment.baseUrl}api/Doctor/update`,data);
  }


  getDoctorsData(): void {

    this.getAllDoctors().subscribe({
      next: (res) => {
        if (res.success) {
          this.doctorsData.set(res.data);
          console.log(res);

        } else {
          this.toastrService.error('فشل في تحميل بيانات العيادات');
        }
      },
      error: (err) => {
        console.error(err);
        this.toastrService.error('حدث خطأ أثناء جلب البيانات');
      }
    });
  }





}
