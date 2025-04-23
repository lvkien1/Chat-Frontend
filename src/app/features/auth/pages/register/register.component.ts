import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { RegisterModel } from '../../../../core/models/user.model';
import { UserActions } from '../../../../store/user/user.actions';
import { selectIsLoading, selectError } from '../../../../store/user/user.selectors';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading$: any;
  error$: any;
  
  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      Username: ['', [Validators.required, Validators.minLength(3)]],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      FullName: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(selectIsLoading);
    this.error$ = this.store.select(selectError);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      // Hiển thị lỗi validation
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const registerModel: RegisterModel = this.registerForm.value;
    this.store.dispatch(UserActions.register({ model: registerModel }));
  }
}
