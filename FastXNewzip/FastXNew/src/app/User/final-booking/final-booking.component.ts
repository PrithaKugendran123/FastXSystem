import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserServicesService } from '../user-services.service';
import { Schedule } from '../../Operator/shared/schedule.model';
import { Bus } from '../bus.model';

@Component({
  selector: 'app-final-booking',
  templateUrl: './final-booking.component.html',
  styleUrls: ['./final-booking.component.css'],
})
export class FinalBookingComponent implements OnInit {
  selectedSeatId: number;
  selectedSeatNumber: number;
  schedule: Schedule;
  busDetails: any;
  routeId: number;
  userId: number;

  constructor(
    private userService: UserServicesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.routeId = params['routeId'];
      const scheduleId = 4;
      this.selectedSeatId = this.userService.getSelectedSeatId();
      this.userId = this.userService.getCurrentUserId();

      console.log('Selected Seat ID:', this.selectedSeatId);

      if (this.selectedSeatId) {
        this.userService.getSeatNumberById(this.selectedSeatId).subscribe(
          (seatNumber: number) => {
            this.selectedSeatNumber = seatNumber;
            console.log('Selected Seat Number:', this.selectedSeatNumber);
          },
          (error) => {
            console.error('Error fetching seat number:', error);
          }
        );
      } else {
        console.warn('No seat ID available');
      }

      this.userService.getScheduleDetailsById(scheduleId).subscribe(
        (schedule: Schedule) => {
          this.schedule = schedule;
          console.log('Fetched schedule details:', this.schedule);

          this.userService.getBusListByRouteId(this.routeId).subscribe(
            (response) => {
              this.busDetails = response;
              console.log('Fetched bus details:', this.busDetails);
            },
            (error) => {
              console.error('Error fetching bus details:', error);
            }
          );
        },
        (error) => {
          console.error('Error fetching schedule details:', error);
        }
      );
    });
  }

  confirmBooking() {
    // Pass data via queryParams to the payment page
    this.router.navigate(['/payment'], {
      queryParams: {
        busId: this.busDetails.buses.$values[0].BusId,
        userId: this.userId,
        seatNumber: this.selectedSeatNumber,
        schedule: JSON.stringify(this.schedule)
      }
    });
  }
}
