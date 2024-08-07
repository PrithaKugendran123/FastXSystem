import { Component, OnInit, ElementRef } from '@angular/core';
import { adminService } from '../../services/admin-service.service';
import { Buses } from '../../services/buses.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-buses',
  templateUrl: './buses.component.html',
  styleUrls: ['./buses.component.css']
})
export class BusesComponent implements OnInit {
  buses: Buses[];
  selectedBus: Buses = new Buses();
  isEditing: boolean = false;

  constructor(
    private adminService: adminService,
    private elementRef: ElementRef,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getBusList();
  }

  getBusList() {
    this.adminService.getBusList().subscribe(
      (data: any) => {
        this.buses = data["$values"];
      },
      error => {
        console.error('Error fetching Bus list:', error);
        this.toastr.error('Error fetching Bus list');
      }
    );
  }

  selectBus(bus: Buses) {
    this.selectedBus = Object.assign({}, bus);
    this.isEditing = true;
    this.scrollToForm();
  }

  cancelEdit() {
    this.selectedBus = new Buses();
    this.isEditing = false;
  }

  updateBus() {
    this.adminService.updateBus(this.selectedBus).subscribe(
      () => {
        this.getBusList();
        this.cancelEdit();
        this.toastr.success('Bus updated successfully');
      },
      error => {
        console.error('Error updating bus:', error);
        this.toastr.error('Error updating bus');
      }
    );
  }

  addBus() {
    this.adminService.addBus(this.selectedBus).subscribe(
      (newBus: Buses) => {
        this.getBusList();
        this.selectedBus = new Buses();
        this.toastr.success('Bus added successfully');
      },
      error => {
        console.error('Error adding bus:', error);
        this.toastr.error('Error adding bus');
      }
    );
  }

  private scrollToForm() {
    setTimeout(() => {
      const formElement = this.elementRef.nativeElement.querySelector('.edit-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
}
