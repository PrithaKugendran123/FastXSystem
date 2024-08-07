import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../auth/services/storage/storage.service';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent {
  showBusImage: boolean = true;

  constructor(private router: Router) {}

  hideBusImage() {
    this.showBusImage = false;
  }

  logout() {
    StorageService.logout();
    this.router.navigateByUrl('/login');
  }
}
