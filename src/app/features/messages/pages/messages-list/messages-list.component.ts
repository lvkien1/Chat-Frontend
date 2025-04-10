import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

import { selectAllChats } from '../../../../store/chat/chat.selectors';

@Component({
  selector: 'app-messages-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule
  ],
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.scss']
})
export class MessagesListComponent implements OnInit {
  chats$: Observable<any[]>;

  constructor(private store: Store) {
    this.chats$ = this.store.select(selectAllChats);
  }

  ngOnInit(): void {
    // Load initial data if needed
  }
}
