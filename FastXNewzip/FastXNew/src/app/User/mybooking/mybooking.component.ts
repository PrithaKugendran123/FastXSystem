import { Component, OnInit } from '@angular/core';
import { UserServicesService } from '../user-services.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Booking } from '../../booking.model';

@Component({
  selector: 'app-mybooking',
  templateUrl: './mybooking.component.html',
  styleUrls: ['./mybooking.component.css']
})
export class MybookingComponent implements OnInit {
  bookings: Booking[] = [];
  currentUserId: number;

  constructor(
    private userService: UserServicesService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.userService.getCurrentUserId();
    this.loadBookingsForCurrentUser();
  }

  navigateToBooking(): void {
    this.router.navigate(['/userbooking']); // Replace with actual route if needed
  }

  loadBookingsForCurrentUser(): void {
    this.userService.getBookingsByUserId(this.currentUserId).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response && response.length) {
          this.bookings = response.reverse();
          console.log('Bookings:', this.bookings);
        } else {
          console.error('Invalid data format:', response);
        }
      },
      (error) => {
        console.error('Error fetching bookings for current user:', error);
      
      }
    );
  }

  cancelLatestBooking(): void {
    if (this.bookings.length > 0) {
      const latestBookingId = this.bookings[0].BookingId; // Get ID of the latest booking
      this.userService.deleteBooking(latestBookingId).subscribe(
        () => {
          this.toastr.success('Your ticket has been cancelled and will be refunded soon.');
          this.loadBookingsForCurrentUser(); // Refresh the list
        },
        (error) => {
          console.error('Error cancelling booking:', error);
          this.toastr.error('Error cancelling booking. Please try again later.');
        }
      );
    } else {
      this.toastr.warning('No bookings available to cancel.');
    }
  }
}
