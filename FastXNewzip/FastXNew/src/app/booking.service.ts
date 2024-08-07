import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Booking } from './booking.model'; // Update the path as needed

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookingDetails = new BehaviorSubject<Booking | null>(null);
  bookingDetails$ = this.bookingDetails.asObservable();

  setBookingDetails(details: Booking): void {
    this.bookingDetails.next(details);
  }

  getBookingDetails(): Booking | null {
    return this.bookingDetails.getValue();
  }
}
