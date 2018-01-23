import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})

export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  // public errorMessage: string;

  constructor(public router: Router, private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: [{ value: '', disabled: false }, [Validators.required]],
      password: [{ value: '', disabled: false }, [Validators.required, Validators.minLength(6), Validators.maxLength(30)]]
    });
  }

  showPassword(input: any): any {
    input.type = 'text';
  }

  hidePassword(input: any): any {
    input.type = 'password';
  }

  login() {
    this.loginForm.disable();
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe(res => {
        if (res) {
          this.authService.isAdminLoggedIn = true;
          this.router.navigate(['/administrator']);
        }
      },
      error => {
        // console.log('Login error', JSON.stringify(error));
      }, () => {
        this.loginForm.enable();
      });
  }

}