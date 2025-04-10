import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil, filter, map } from 'rxjs/operators';

import { Chat, getChatName, getChatAvatar, getTypingUsersText } from '../../../../core/models/chat.model';
import { Message, MessageAttachment } from '../../../../core/models/message.model';
import { ChatActions } from '../../../../store/chat/chat.actions';
import { MessageBubbleComponent } from '../../../../shared/components/message-bubble/message-bubble.component';
import { MessageInputComponent } from '../../../../shared/components/message-input/message-input.component';
import * as ChatSelectors from '../../../../store/chat/chat.selectors';
import * as UserSelectors from '../../../../store/user/user.selectors';
import { selectCurrentTheme } from '../../../../store/user/user.selectors';
import { ChatUtil } from '../../../../utils/ChatUtil';

@Component({
  selector: 'app-chat-detail',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    MessageBubbleComponent,
    MessageInputComponent,
  ],
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.scss'],
})
export class ChatDetailComponent implements OnInit, OnDestroy {
  ChatUtil = ChatUtil;
  chat$: Observable<Chat | null>;
  messages$: Observable<Message[]>;
  currentUserId$: Observable<string>;
  chatName$: Observable<string>;
  chatAvatar$: Observable<string>;
  typingStatus$: Observable<string>;
  // currentTheme$: Observable<'light' | 'dark'>;

  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private store: Store) {
    this.currentUserId$ = this.store
      .select(UserSelectors.selectCurrentUser)
      .pipe(map((user) => user?.id ?? ''));
    
    // this.currentTheme$ = this.store.select(selectCurrentTheme);

    this.chat$ = this.store
      .select(ChatSelectors.selectCurrentChat)
      .pipe(map((chat) => chat || null));

    this.messages$ = this.store.select(ChatSelectors.selectCurrentChatMessages);

    this.chatName$ = combineLatest([this.chat$, this.currentUserId$]).pipe(
      map(([chat, userId]) => (chat ? getChatName(chat, userId) : ''))
    );

    this.chatAvatar$ = combineLatest([this.chat$, this.currentUserId$]).pipe(
      map(([chat, userId]) => (chat ? getChatAvatar(chat, userId) : ''))
    );

    this.typingStatus$ = combineLatest([this.chat$, this.currentUserId$]).pipe(
      map(([chat, userId]) => (chat ? getTypingUsersText(chat, userId) : ''))
    );
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const chatId = params['id'];
      this.store.dispatch(ChatActions.setCurrentChat({ chatId }));
      this.store.dispatch(ChatActions.loadMessages({ chatId }));
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(ChatActions.clearCurrentChat());
    this.destroy$.next();
    this.destroy$.complete();
  }

  onMessageSent(content: string): void {
    const chatId = this.route.snapshot.params['id'];
    this.store.dispatch(
      ChatActions.sendMessage({
        chatId,
        content,
        attachments: [],
      })
    );
  }

  onFileSelected(file: File): void {
    const chatId = this.route.snapshot.params['id'];
    this.store.dispatch(ChatActions.uploadFile({ chatId, file }));
  }

  onTyping(isTyping: boolean): void {
    const chatId = this.route.snapshot.params['id'];
    this.store.dispatch(ChatActions.updateTypingStatus({ chatId, isTyping }));
  }

  onFileClick(attachment: MessageAttachment): void {
    // Handle file click (e.g., download or preview)
    window.open(attachment.url, '_blank');
  }

  onImageClick(attachment: MessageAttachment): void {
    // Handle image click (e.g., open preview dialog)
    window.open(attachment.url, '_blank');
  }
}
