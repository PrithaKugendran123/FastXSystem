import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() {
    // Set the fonts for pdfmake
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  generateBookingSummary(bookingData: any): Observable<Blob> {
    const documentDefinition = {
      content: [
        { text: 'Booking Summary', style: 'header' },
        {
          style: 'tableExample',
          table: {
            body: [
              ['Bus ID', 'User ID', 'Seat Numbers', 'Total Cost', 'Booking Date'],
              [
                bookingData.BusId,
                bookingData.UserId,
                bookingData.SeatNumbers,
                bookingData.TotalCost,
                bookingData.BookingDate.toDateString()
              ]
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 20]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        }
      }
    };

    // Create PDF and return as Blob observable
    return new Observable<Blob>(observer => {
      pdfMake.createPdf(documentDefinition).getBlob((blob: Blob) => {
        observer.next(blob);
        observer.complete();
      });
    }).pipe(
      catchError(error => {
        console.error('Error creating PDF:', error);
        return from([]);
      })
    );
  }
}
