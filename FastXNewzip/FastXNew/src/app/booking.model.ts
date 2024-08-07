import { User } from "./module/admin/services/user.model";
import { Schedule } from "./Operator/shared/schedule.model";
import { Bus } from "./User/bus.model";
import { Payment } from "./User/payment.model";

// booking.model.ts
export interface Booking {
  BookingId?: number;
  BusId?: number;
  ScheduleId?: number;
  UserId?: number;
  TotalSeats?: number;
  SeatNumbers?: string;
  TotalCost?: number;
  BookingDate: Date;
  BusType?: string;
  BusName?: string;
  BusNumber?: string;
  UserName?: string; // Ensure this matches exactly
  Email?: string;
  PickUp?: string;
  DropPoint?: string; // Ensure this matches exactly
  Bus?: Bus | null; 
  BusSchedule?: Schedule | null; 
  User?: User | null; 
  payments?: Payment[] | null;
}
