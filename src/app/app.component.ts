import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { NavigationSidebarComponent } from './shared/components/navigation-sidebar/navigation-sidebar.component';
import { UserActions } from './store/user/user.actions';
import { selectCurrentTheme } from './store/user/user.selectors';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavigationSidebarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private themeSubscription = new Subscription();
  
  constructor(private store: Store, private renderer: Renderer2) {}

  ngOnInit() {
    // Load the current user when the app starts
    this.store.dispatch(UserActions.loadCurrentUser());
    
    // Subscribe to theme changes
    this.themeSubscription = this.store.select(selectCurrentTheme).subscribe(theme => {
      debugger
      // Apply theme to document
      this.renderer.setAttribute(document.documentElement, 'data-theme', theme);
    });
    debugger
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      this.store.dispatch(UserActions.setTheme({ theme: savedTheme as 'light' | 'dark' }));
    }
  }
  
  ngOnDestroy() {
    // Clean up subscription
    this.themeSubscription.unsubscribe();
  }
}
