export interface IAppointment {
  id: string;
  day: number;
  startTime: string;
  endTime: string;
  duration: number;
  isAvailable: boolean;
  doctorId: string;
}
