import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  customerForm: FormGroup;
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  registrationError: string;

  constructor(private fb: FormBuilder, public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      Name: ['', Validators.required],
      Gender: ['', Validators.required],
      ContactNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15)]],
      Address: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      RePassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validator: this.passwordMatchValidator });
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = 'fa-eye' : this.eyeIcon = 'fa-eye-slash';
    this.isText ? this.type = 'text' : this.type = 'password';
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('Password');
    const confirmPassword = control.get('RePassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ 'passwordMismatch': true });
      return { 'passwordMismatch': true };
    } else {
      confirmPassword.setErrors(null);
      return null;
    }
  }

  register() {
    if (this.customerForm.valid) {
      const formData = this.customerForm.value;
      formData.Role = 'User';

      this.authService.register(formData).subscribe(
        (response) => {
          alert("Registered successfully");
          this.customerForm.reset();
          this.router.navigateByUrl("/login");
        },
        (error: HttpErrorResponse) => {
          console.error("Registration Error:", error);
          if (error.status === 409 && error.error === "The email address is already in use.") {
            this.registrationError = "The email address is already in use.";
          } else {
            this.registrationError = "The email address is already in use.Please give a new one";
          }
        }
      );
    } else {
      alert("Please fill out the form correctly.");
    }
  }
}
