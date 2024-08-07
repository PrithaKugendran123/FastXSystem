import { Component, OnInit } from '@angular/core';
import { OpServiceService } from '../shared/op-servie.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  bookingWithBusDetails: any[] = [];

  constructor(private opService: OpServiceService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadBookingWithBusDetails();
  }

  loadBookingWithBusDetails() {
    console.log('Loading booking data...');
    this.opService.getBookingwithBusDetails().subscribe(
      (data: any) => {
        console.log('Received data:', data);
        
        // Ensure data is in the correct format
        if (data && data.$values && Array.isArray(data.$values)) {
          this.bookingWithBusDetails = data.$values.map(booking => ({
            BookingId: booking.BookingId || '',
            UserName: booking.UserName || 'Unknown',
            Email: booking.Email || 'Unknown',
            BusName: booking.BusName || 'Unknown',
            BusNumber: booking.BusNumber || 'Unknown',
            SeatNumbers: booking.SeatNumbers || '',
            TotalCost: booking.TotalCost || 0,
            BookingDate: booking.BookingDate ? new Date(booking.BookingDate) : new Date()
          }));
          console.log('Processed data:', this.bookingWithBusDetails);
        } else {
          console.error('Invalid data format. Expected an object with $values property as an array.');
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  delRecord(pid: number) {
    if (confirm("Are you sure?")) {
      this.opService.delBooking(pid).subscribe(
        res => {
          this.toastr.success('Booking deleted successfully!', 'Success');
          this.loadBookingWithBusDetails(); // Reload booking data after deletion
        },
        err => {
          this.toastr.error('Error occurred while deleting booking', 'Error');
        }
      );
    }
  }
}
