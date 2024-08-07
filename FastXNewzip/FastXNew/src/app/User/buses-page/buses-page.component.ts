import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserServicesService } from '../user-services.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-buses-page',
  templateUrl: './buses-page.component.html',
  styleUrls: ['./buses-page.component.css']
})
export class BusesPageComponent implements OnInit {
  routeId: number;
  availableBuses: any[] = [];
  filteredBuses: any[] = [];
  selectedBusId: number;
  selectedSeatId: number;
  selectedSeats: number[] = [];
  busTypeFilter: string = '';
  seatTypeFilter: string = '';
  noBusesFound: boolean = false;
  isImageVisible: boolean = false; // Add this line
  isPoliciesVisible: boolean = false;
  isDropdownVisible: boolean = false;
  bookingDate: string; // Add this line

  @ViewChild('seatAvailabilityContainer', { read: ViewContainerRef }) seatAvailabilityContainer: ViewContainerRef;

  constructor(
    private route: ActivatedRoute,
    private userService: UserServicesService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.routeId = +params.get('id');
      this.fetchAvailableBuses();
    });

    this.route.queryParams.subscribe(params => {
      this.bookingDate = params['bookingDate']; // Capture the booking date from query parameters
    });

    this.checkSeatSelection();
  }

  fetchAvailableBuses(): void {
    this.userService.getBusListByRouteId(this.routeId).subscribe(
      (data: any) => {
        console.log('Received data:', data);
        if (data && data.buses && data.buses.$values) {
          this.availableBuses = data.buses.$values;
          this.filteredBuses = [...this.availableBuses];
          this.availableBuses.forEach(bus => bus.showSeatDropdown = false);
        } else {
          console.error('Invalid data structure:', data);
        }
      },
      (error) => {
        console.error('Error fetching available buses:', error);
      }
    );
  }

  showSeatDropdown(bus: any): void {
    bus.showSeatDropdown = !bus.showSeatDropdown;
    bus.showStatusImages = bus.showSeatDropdown;
  
    if (bus.showSeatDropdown) {
      this.userService.getSeatsByBusId(bus.BusId).subscribe(
        (data: any) => {
          console.log('Fetched Seat Details for Bus ID', bus.BusId, ':', data);
          bus.Seats = data?.$values || []; 
          bus.seatsShown = true;
  
          this.availableBuses.forEach(b => {
            if (b !== bus) {
              b.showSeatDropdown = false;
              b.showStatusImages = false;
              b.seatsShown = false;
            }
          });
  
          this.cdr.detectChanges(); // Trigger change detection
        },
        (error) => {
          console.error('Error fetching seat details:', error);
        }
      );
    } else {
      bus.Seats = null;
      bus.seatsShown = false;
    }
  }

  toggleDropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }
  
  bookTicket(bus: any, selectedSeatId: number): void {
    const seat = Array.isArray(bus.Seats) ? bus.Seats.find((s: any) => s.SeatId === selectedSeatId) : null;
  
    if (!seat || !seat.IsAvailable) {
      console.error('Seat is not available.');
      return;
    }
  
    this.userService.updateSeatStatus(selectedSeatId, false).subscribe(
      () => {
        const ticketPrice = 20;
        const bookingData = {
          busDetails: bus,
          selectedSeatId: selectedSeatId,
          ticketPrice: ticketPrice,
          routeId: this.routeId,
          userId: this.userService.getCurrentUserId(),
          busId: bus.BusId,
          bookingDate: this.bookingDate // Add booking date to the data being passed
        };
  
        this.router.navigate(['/final-booking'], { queryParams: bookingData })
          .then(() => {
            console.log('Navigated to /final-booking route with queryParams:', bookingData);
          })
          .catch(error => {
            console.error('Error navigating to /final-booking route:', error);
          });
      },
      error => {
        console.error('Error updating seat status:', error);
      }
    );
  }
  
  toggleSeatSelection(seatId: number): void {
    const allSeats = this.filteredBuses.flatMap(bus => bus.Seats || []); 
    const seat = allSeats.find(seat => seat.SeatId === seatId);
  
    if (!seat || !seat.IsAvailable) {
      return;
    }
  
    const index = this.selectedSeats.indexOf(seatId);
    if (index === -1) {
      this.selectedSeats.push(seatId);
      this.userService.setSelectedSeatId(seatId);
    } else {
      this.selectedSeats.splice(index, 1);
      this.userService.setSelectedSeatId(null);
    }
    this.checkSeatSelection();
  }
  
  checkSeatSelection(): void {
    this.selectedSeatId = this.selectedSeats.length > 0 ? this.selectedSeats[0] : null;
  }

  isSeatSelected(seatId: number): boolean {
    return this.selectedSeats.includes(seatId);
  }

  applyFilters(): void {
    let filteredByBusType = this.availableBuses.filter(bus => {
      return this.busTypeFilter === '' || bus.BusType.toLowerCase() === this.busTypeFilter.toLowerCase();
    });

    this.filteredBuses = filteredByBusType.filter(bus => {
      return this.seatTypeFilter === '' || bus.SeatType.toLowerCase() === this.seatTypeFilter.toLowerCase();
    });

    this.noBusesFound = this.filteredBuses.length === 0;
  }
  
  constructImageUrl(busId: number): string {
    const imageUrls: { [key: number]: string } = {
      1: 'assets/images/bus1.jpeg',
      3: 'assets/images/bus31.jpeg',
      4: 'assets/images/bus 4.jpg',
      5: 'assets/images/bus 13.jpg',
      6: 'assets/images/bus 5.jpg',
      7: 'assets/images/bus 10.jpg',
      8: 'assets/images/bus 14.jpg',
      9: 'assets/images/bus 16.jpg',
      10: 'assets/images/bus 12.jpg',
      11: 'assets/images/bus2.jpeg',
      12: 'assets/images/bus 5.jpg',
      13: 'assets/images/bus 6.jpg',
      14: 'assets/images/bus 9.jpg',
      15: 'assets/images/bus 9.jpg',
      16: 'assets/images/bus 5.jpg'
    };

    return imageUrls[busId] || 'assets/images/default.jpeg';
  }
}
