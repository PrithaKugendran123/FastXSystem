import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserServicesService } from '../User/user-services.service';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css']
})
export class TicketDetailsComponent implements OnInit {
  bookingData: any;
  busDetails: any;
  schedule: any;

  constructor(
    private route: ActivatedRoute,
    private userService: UserServicesService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const bookingDataString = params['bookingData'];
      if (bookingDataString) {
        try {
          this.bookingData = JSON.parse(bookingDataString);
          console.log('Booking Data:', this.bookingData);
          
          // Fetch bus details if not included in bookingData
          if (!this.bookingData.busDetails && this.bookingData.BusId) {
            this.userService.getBusById(this.bookingData.BusId).subscribe(
              (bus) => {
                this.busDetails = bus;
                console.log('Bus Details:', this.busDetails);
              },
              (error) => {
                console.error('Error fetching bus details:', error);
              }
            );
          } else {
            this.busDetails = this.bookingData.busDetails;
          }

          // Fetch schedule details if not included in bookingData
          if (!this.bookingData.schedule && this.bookingData.ScheduleId) {
            this.userService.getScheduleDetailsById(this.bookingData.ScheduleId).subscribe(
              (schedule) => {
                this.schedule = schedule;
                console.log('Schedule Details:', this.schedule);
              },
              (error) => {
                console.error('Error fetching schedule details:', error);
              }
            );
          } else {
            this.schedule = this.bookingData.schedule;
          }
        } catch (error) {
          console.error('Error parsing bookingData:', error);
        }
      } else {
        console.error('No bookingData found in query params');
      }
    });
  }
}
