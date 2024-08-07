import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { StorageService } from './auth/services/storage/storage.service';
import { UserServicesService } from './User/user-services.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  title = 'FastXFrontend';
  isCustomerLoggedIn:boolean=StorageService.isUserLoggedIn();
  isAdminLoggedIn:boolean=StorageService.isAdminLoggedIn();
  isOperatorLoggedIn:boolean=StorageService.isOperatorLoggedIn();

  constructor(private router:Router,private userService: UserServicesService) {
   
  }
  ngOnInit(){
    this.router.events.subscribe(event=>{
      if(event.constructor.name==="NavigationEnd"){
        this.isAdminLoggedIn= StorageService.isAdminLoggedIn();
        this.isCustomerLoggedIn=StorageService.isUserLoggedIn();
        this.isOperatorLoggedIn=StorageService.isOperatorLoggedIn();
        this.userService.getSeatList().subscribe();
      }
    })
  }

  // logout(){
  //   StorageService.logout();
  //   this.router.navigateByUrl("/login");
  // }
}
