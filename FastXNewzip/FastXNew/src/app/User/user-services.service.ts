import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, switchMap, tap, throwError } from 'rxjs';
import { Route } from '../module/admin/services/route.model';
import { Router } from '@angular/router';
import { Seat } from '../Operator/shared/seat.model';
import { Bus } from './bus.model';
import { Booking } from '../Operator/shared/booking.model';
import { Schedule } from '../Operator/shared/schedule.model';
import { User } from '../module/admin/services/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserServicesService {
  readonly BppApiUrl = "http://localhost:5030/api/busroutes"; 
  readonly SppApiUrl = "http://localhost:5030/api/seats";
  readonly BusesApiUrl = "http://localhost:5030/api/buses";
  readonly ScheduleApiUrl = 'http://localhost:5030/api/BusSchedules';
  readonly bookingApiUrl = 'http://localhost:5030/api/bookings';
  readonly ApiUrl='http://localhost:5030/api/users'
  readonly BusApiUrl = "http://localhost:5030/api/buses/bus";
  private apiUrl = 'http://localhost:5030/api';
  public blist: Route[] = [];
  public seats: Seat[] = [];
  public buses: Bus[] = [];
  bppData: Route = new Route();
  selectedSeatNumber: number;
  private currentUserId: number;
  private selectedBusId: number;
  private selectedSeatId: number;
  private bookingData: any;
  private seatIdToNumberMap: { [key: number]: number } = {};
  constructor(private http: HttpClient, private router: Router) {}

  public getBusRouteList(): Observable<any> {
    return this.http.get<any>(this.BppApiUrl).pipe(
      tap((data) => console.log('Received data:', data)),
      catchError((error) => {
        console.error('Error fetching bus route list:', error);
        return throwError(error);
      })
    );
  }
  
 updateSeatStatus(seatId: number, isAvailable: boolean): Observable<any> {
  console.log('Updating seat status for seatId:', seatId, 'with availability:', isAvailable);
  
  // Send the boolean value directly
  return this.http.put(`${this.SppApiUrl}/Select/${seatId}`, isAvailable, {
    headers: { 'Content-Type': 'application/json' }
  });
}


  public getBusListByRouteId(routeId: number): Observable<any[]> {
    const url = `${this.BppApiUrl}/${routeId}`;
    return this.http.get<any[]>(url);
  }
  
  public checkSeatAvailability(busId: number): void {
    const seatAvailabilityRoute = `/seat-availability/${busId}`;
    this.router.navigate([seatAvailabilityRoute]);
  }

  public getSeatList(): Observable<Seat[]> {
    return this.http.get<Seat[]>(this.SppApiUrl); 
  }


  public getBusById(busId: number): Observable<any> {
    const url = `${this.BusesApiUrl}/${busId}`;
    return this.http.get<any>(url).pipe(
      catchError((error) => {
        console.error('Error fetching bus details:', error);
        return throwError(error);
      })
    );
  }
  public getBuses(): Observable<Bus[]> {
    const url = `${this.BusesApiUrl}`;
    return this.http.get<Bus[]>(url);
  }

  public getSeatsByBusId(busId: number): Observable<Seat[]> {
    const url = `${this.SppApiUrl}?busId=${busId}`;
    return this.http.get<Seat[]>(url).pipe(
      tap((data) => console.log('Fetched Seat Availability Data:', data)),
      catchError((error) => {
        console.error('Error fetching seat availability:', error);
        return throwError(error);
      })
    );
  }
  // public getScheduleByBusId(busId: number): Observable<Schedule> {
  //   const url = `${this.ScheduleApiUrl}/ByBusId/${busId}`;
  //   return this.http.get<Schedule>(url).pipe(
  //     catchError((error) => {
  //       console.error('Error fetching schedule details:', error);
  //       return throwError(error);
  //     })
  //   );
  // }
  setSelectedBusId(busId: number): void {
    this.selectedBusId = busId;
  }
 
  getSelectedBusId(): number | null {
    return this.selectedBusId;
  }
  public getBookings(bookingId: number): Observable<Booking> {
    const url = `${this.bookingApiUrl}/${bookingId}`;
    return this.http.get<Booking>(url);
  } 

  // public postBooking(booking: Booking): Observable<Booking> {
  //   return this.http.post<Booking>(this.bookingApiUrl, booking);
  // }
  
  postBooking(booking: Booking): Observable<Booking> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<Booking>(`${this.apiUrl}/bookings`, booking, { headers });
  }
  public setCurrentUserId(userId: number): void {
    this.currentUserId = userId;
    console.log('Current user ID set in service:', this.currentUserId); 
  }
  
  public getCurrentUserId(): number {
    console.log('Getting current user ID:', this.currentUserId); 
    return this.currentUserId;
  }
  setSelectedSeatId(seatId: number): void {
    this.selectedSeatId = seatId;
  }
  createBooking(bookingPayload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/bookings`, bookingPayload);
  }
  
  getSelectedSeatId(): number {
    return this.selectedSeatId;
  }
  public getScheduleDetailsById(scheduleId: number): Observable<Schedule> {
    const url = `${this.ScheduleApiUrl}/${scheduleId}`;
    return this.http.get<Schedule>(url).pipe(
      tap((data) => console.log('Received schedule details:', data)),
      catchError((error) => {
        console.error('Error fetching schedule details:', error);
        return throwError(error);
      })
    );
  }
  public getSeatNumberById(seatId: number): Observable<number> {
    const url = `${this.SppApiUrl}/${seatId}`;
    return this.http.get<any>(url).pipe(
      map(response => response.SeatNumber), // Ensure SeatNumber is the correct field
      tap(seatNumber => console.log('API Response Seat Number:', seatNumber)),
      catchError((error) => {
        console.error('Error fetching seat number:', error);
        return throwError(error);
      })
    );
  }
  
  
  
  
  
  
  // public getBusDetailsById(busId: number): Observable<Bus> {
  //   const url = `${this.BusesApiUrl}/${busId}`;
  //   return this.http.get<Bus>(url).pipe(
  //     catchError((error) => {
  //       console.error('Error fetching bus details:', error);
  //       return throwError(error);
  //     })
  //   );
  // }
  setBookingData(data: any): void {
    this.bookingData = data;
  }

  getBookingData(): any {
    return this.bookingData;
  }
  // public getBookingsByUserId(userId: number): Observable<Booking[]> {
  //   const url = `${this.bookingApiUrl}/user/${userId}`;
  //   return this.http.get<Booking[]>(url).pipe(
  //     catchError((error) => {
  //       console.error('Error fetching bookings for user:', error);
  //       return throwError(error);
  //     })
  //   );
  // }
  getUser(): Observable<User> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return throwError("No user ID available");
    }
  
    return this.http.get<User>(`${this.ApiUrl}/${userId}`).pipe(
      catchError((error) => {
        console.error('Error fetching user details:', error);
        return throwError(error);
      })
    );
  }
  

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.ApiUrl}/${user.UserId}`, user).pipe(
      catchError((error) => {
        console.error('Error updating user:', error);
        return throwError(error);
      })
    );
  }
  // UserServicesService (already provided in the previous response)
public getBusAndUserDetails(busId: number, userId: number): Observable<{ bus: Bus, user: User }> {
  return this.http.get<Bus>(`${this.BusesApiUrl}/buses/${busId}`).pipe(
    tap(bus => console.log('Fetched Bus Details:', bus)),
    switchMap(bus => 
      this.http.get<User>(`${this.ApiUrl}/${userId}`).pipe(
        tap(user => console.log('Fetched User Details:', user)),
        map(user => ({ bus, user })) // Combine results
      )
    ),
    catchError((error) => {
      console.error('Error fetching bus and user details:', error);
      return throwError(error);
    })
  );
}
public getUserById(userId: number): Observable<User> {
  const url = `${this.ApiUrl}/${userId}`;
  return this.http.get<User>(url).pipe(
    catchError((error) => {
      console.error('Error fetching user details:', error);
      return throwError(error);
    })
  );
}
public getBusDetailsById(busId: number): Observable<Bus> {
  const url = `${this.BusesApiUrl}/bus/${busId}`;
  return this.http.get<Bus>(url).pipe(
    tap((data) => console.log('Fetched Bus Details:', data)),
    catchError((error) => {
      console.error('Error fetching bus details:', error);
      return throwError(error);
    })
  );
}

public getScheduleByBusId(busId: number): Observable<Schedule> {
  const url = `${this.ScheduleApiUrl}/ByBusId/${busId}`;
  return this.http.get<Schedule>(url).pipe(
    tap((data) => console.log('Fetched Schedule Details:', data)),
    catchError((error) => {
      console.error('Error fetching schedule details:', error);
      return throwError(error);
    })
  );
}
// getBookingsByUserId(userId: number): Observable<Booking[]> {
//   return this.http.get<Booking[]>(`${this.bookingApiUrl}/user/${userId}`);
// }


// public getBusDetailsById(busId: number): Observable<Bus> {
//   const url = `${this.BusesApiUrl}/bus/${busId}`;
//   return this.http.get<Bus>(url).pipe(
//     tap((data) => console.log('Fetched Bus Details:', data)),
//     catchError((error) => {
//       console.error('Error fetching bus details:', error);
//       return throwError(error);
//     })
//   );
// }

getBookingsByUserId(userId: number): Observable<Booking[]> {
  const url = `${this.bookingApiUrl}/user/${userId}`;
  return this.http.get<{ $id: string, $values: Booking[] }>(url).pipe(
    map(response => response.$values),
    tap(bookings => console.log('Fetched bookings:', bookings)), // Debug log
    catchError(error => {
      console.error('Error fetching bookings for user:', error);
      return throwError(error);
    })
  );
}

public cancelBooking(bookingId: number): Observable<void> {
  const url = `${this.bookingApiUrl}/${bookingId}/cancel`; // Adjust URL if needed
  return this.http.post<void>(url, {}).pipe(
    catchError((error) => {
      console.error('Error cancelling booking:', error);
      return throwError(error);
    })
  );
}
public deleteBooking(bookingId: number): Observable<void> {
  const url = `${this.bookingApiUrl}/${bookingId}`;
  return this.http.delete<void>(url).pipe(
    tap(() => console.log('Booking deleted:', bookingId)),
    catchError((error) => {
      console.error('Error deleting booking:', error);
      return throwError(error);
    })
  );
}

}
