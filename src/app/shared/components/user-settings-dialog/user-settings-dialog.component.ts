import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { UserActions } from '../../../store/user/user.actions';
import * as UserSelectors from '../../../store/user/user.selectors';
import { UserSettings, User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-settings-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-settings-dialog.component.html',
  styleUrls: ['./user-settings-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSettingsDialogComponent {
  settingsForm: FormGroup;
  currentUser$: Observable<User | null>;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private dialogRef: MatDialogRef<UserSettingsDialogComponent>
  ) {
    this.currentUser$ = this.store.select(UserSelectors.selectCurrentUser);
    this.settingsForm = this.formBuilder.group({
      enableNotifications: [false],
      soundEnabled: [true],
      theme: ['light'],
      showReadReceipts: [true],
      showOnlineStatus: [true]
    });

    // Load current settings
    this.store.select(UserSelectors.selectUserSettings)
      .pipe(take(1))
      .subscribe(settings => { 
        if (settings) {
          this.settingsForm.patchValue(settings);
        }
      });
  }

  onSubmit(): void {
    if (this.settingsForm.valid) {
      this.currentUser$.pipe(take(1)).subscribe(user => {
        if (user) {
          // Update theme if changed
          const newTheme = this.settingsForm.get('theme')?.value;
          const settings: UserSettings = {
            ...this.settingsForm.value,
            userId: user.id,
            lastUpdated: new Date()
          };
          
          this.store.dispatch(UserActions.updateSettings({ 
            userId: user.id,
            settings 
          }));

          if (newTheme) {
            this.store.dispatch(UserActions.setTheme({ theme: newTheme }));
          }

          this.dialogRef.close();
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
