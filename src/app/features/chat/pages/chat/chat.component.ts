import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { Chat, getChatName, getChatAvatar } from '../../../../core/models/chat.model';
import { UserSelectors } from '../../../../store/user';
import * as ChatSelectors from '../../../../store/chat/chat.selectors';
import { ChatActions } from '../../../../store/chat/chat.actions';
import { ChatUtil } from '../../../../utils/ChatUtil';
import { selectCurrentTheme } from '../../../../store/user/user.selectors';

interface ChatViewModel {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
  unreadCount: number;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  chatViewModels$: Observable<ChatViewModel[]>;
  currentTheme$: Observable<'light' | 'dark'>;
  ChatUtil = ChatUtil;

  constructor(private store: Store) {
    const chats$ = this.store.select(ChatSelectors.selectAllChats);
    const currentUserId$ = this.store
      .select(UserSelectors.selectCurrentUser)
      .pipe(map((user) => user?.Id ?? ''));
    this.currentTheme$ = this.store.select(selectCurrentTheme);

    this.chatViewModels$ = combineLatest([chats$, currentUserId$]).pipe(
      map(([chats, userId]) =>
        chats.map((chat) => ({
          id: chat.id,
          name: getChatName(chat, userId),
          avatar: getChatAvatar(chat, userId),
          lastMessage: chat.lastMessage
            ? {
                content: chat.lastMessage.content,
                timestamp: chat.lastMessage.timestamp,
              }
            : undefined,
          unreadCount: chat.unreadCount,
        }))
      )
    );
  }

  ngOnInit(): void {
    this.store.dispatch(ChatActions.loadChats());
  }

  onNewChat(): void {
    // TODO: Implement new chat dialog
    console.log('New chat clicked');
  }
}
