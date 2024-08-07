import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserServicesService } from '../user-services.service';
import { Booking } from '../../Operator/shared/booking.model';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  paymentMethod: string = '';
  accountDetails: string = '';
  paymentDate: Date = new Date();
  transactionStatus: string = 'Pending';
  totalPrice: number = 1000; // Initialize with a default value
  busId: number = 0;
  userId: number = 0;

  constructor(
    private userService: UserServicesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.busId = +params['busId'];
      this.userId = +params['userId'];
      console.log('Bus ID:', this.busId);
      console.log('User ID:', this.userId);

      // Fetch schedule details and calculate total price here
      this.userService.getScheduleDetailsById(this.busId).subscribe(
        (scheduleDetails) => {
          if (scheduleDetails && scheduleDetails.Fare) {
            this.totalPrice = scheduleDetails.Fare;
          }
        },
        (error) => {
          console.error('Error fetching schedule details:', error);
        }
      );
    });
  }

  submitPayment(): void {
    const bookingData: Booking = {
      BusId: this.busId,
      ScheduleId: 4, // Adjust as needed
      UserId: this.userId,
      TotalSeats: 1,
      SeatNumbers: this.userService.getSelectedSeatId().toString(),
      TotalCost: 1000,
      BookingDate: new Date(),
      BusType: '', // Add as needed
      PickUp: '', // Add as needed
      DropPoint: '' // Add as needed
      ,
      BusName: '',
      BusNumber: '',
      Username: ''
    };

    this.userService.postBooking(bookingData).subscribe(
      (createdBooking) => {
        console.log('Booking created successfully:', createdBooking);
        alert('Payment successful! Booking confirmed.');
        this.router.navigateByUrl('/mybooking');
      },
      (error) => {
        console.error('Error creating booking:', error);
        alert('Error creating booking. Please try again later.');
      }
    );
  }
}
