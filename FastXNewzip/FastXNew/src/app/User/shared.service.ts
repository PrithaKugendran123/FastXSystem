import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private travelDate: string;

  setTravelDate(date: string): void {
    this.travelDate = date;
  }

  getTravelDate(): string {
    return this.travelDate;
  }
}
