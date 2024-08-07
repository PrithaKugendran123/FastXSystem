import { Schedule } from "../../../Operator/shared/schedule.model";
import { Bus } from "../../../User/bus.model";
import { Payment } from "../../../User/payment.model";
import { User } from "./user.model";


export interface Booking {
    BookingId?: number;
    BusId?: number;
    ScheduleId?: number;
    UserId?: number;
    TotalSeats?: number;
    SeatNumbers?: string;
    TotalCost?: number;
    BookingDate: Date;
    BusType:string;
    PickUp:string;
    DropPoint:string;

    Bus?: Bus | null; 
    BusSchedule?: Schedule | null; 
    User?: User | null; 
    payments?: Payment[] | null;
}
