import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  constructor(private httpClient:HttpClient) { }

  createAppointment(data:object):Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}api/Appointment`,data);
  }

  UpdateAppointment(data:object,id:string):Observable<any>{
    return this.httpClient.put(`${environment.baseUrl}api/Appointment/${id}`,data);
  }

  deleteAppointment(id:string):Observable<any>{
    return this.httpClient.delete(`${environment.baseUrl}api/Appointment/${id}`);
  }


  getAvailableSlotsForDoctor(doctorID:string):Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}api/Appointment/AvailableSlots?doctorId=${doctorID}`);
  }

  getDoctorAppointments():Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}api/Appointment/DoctorAppointments`);
  }

  getAllAppointments():Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}api/Appointment`);
  }

  getSpecficAppointmentByID(appointmentID:string):Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}api/Appointment/${appointmentID}`);
  }
}
