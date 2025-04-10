import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { User } from '../../../core/models/user.model';
import { selectCurrentUser, selectCurrentTheme } from '../../../store/user/user.selectors';
import { UserActions } from '../../../store/user/user.actions';

@Component({
  selector: 'app-navigation-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, UserAvatarComponent],
  templateUrl: './navigation-sidebar.component.html',
  styleUrls: ['./navigation-sidebar.component.scss'],
})
export class NavigationSidebarComponent implements OnInit {
  currentUser$: Observable<User | null>;
  currentTheme$: Observable<'light' | 'dark'>;

  constructor(private store: Store) {
    this.currentUser$ = this.store.select(selectCurrentUser);
    this.currentTheme$ = this.store.select(selectCurrentTheme);
  }

  ngOnInit(): void {}

  toggleTheme(): void {
    this.currentTheme$.pipe(take(1)).subscribe(currentTheme => {
      debugger
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      this.store.dispatch(UserActions.setTheme({ theme: newTheme }));
    });
  }

  openSettings(): void {
    // TODO: Implement settings dialog
  }
}
