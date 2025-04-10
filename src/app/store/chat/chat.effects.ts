import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap, mergeMap } from 'rxjs/operators';

import { ChatService } from '../../core/services/chat.service';
import { WebSocketService } from '../../core/services/websocket.service';
import { ChatActions } from './chat.actions';
import { Chat } from '../../core/models/chat.model';
import { Message } from '../../core/models/message.model';

@Injectable()
export class ChatEffects {
  private actions$ = inject(Actions);
  constructor(
    private chatService: ChatService,
    private webSocketService: WebSocketService,
    private store: Store
  ) {
    console.log(this.actions$, chatService, webSocketService, store);
  }

  loadChats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.loadChats),
      switchMap(() =>
        this.chatService.getChats().pipe(
          map((chats) => ChatActions.loadChatsSuccess({ chats })),
          catchError((error) => of(ChatActions.loadChatsFailure({ error })))
        )
      )
    )
  );

  loadMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.loadMessages),
      switchMap(({ chatId }) =>
        this.chatService.getMessages(chatId).pipe(
          map((messages) => ChatActions.loadMessagesSuccess({ messages })),
          catchError((error) => of(ChatActions.loadMessagesFailure({ error })))
        )
      )
    )
  );

  sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.sendMessage),
      mergeMap(({ chatId, content, attachments }) =>
        this.chatService.sendMessage(chatId, content, attachments).pipe(
          tap((message) => this.webSocketService.sendMessage(message)),
          map((message) => ChatActions.sendMessageSuccess({ message })),
          catchError((error) => of(ChatActions.sendMessageFailure({ error })))
        )
      )
    )
  );

  uploadFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.uploadFile),
      switchMap(({ chatId, file }) =>
        this.chatService.uploadFile(chatId, file).pipe(
          map((message) => ChatActions.uploadFileSuccess({ message })),
          catchError((error) => of(ChatActions.uploadFileFailure({ error })))
        )
      )
    )
  );

  // WebSocket Effects
  listenToWebSocket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.initializeWebSocket),
      switchMap(() => this.webSocketService.getMessages()),
      map((message) => ChatActions.messageReceived({ message }))
    )
  );

  listenToTyping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.initializeWebSocket),
      switchMap(() => this.webSocketService.getTypingUpdates()),
      map(({ chatId, userId, isTyping }) =>
        ChatActions.typingStatusUpdated({ chatId, userId, isTyping })
      )
    )
  );

  listenToReadReceipts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.initializeWebSocket),
      switchMap(() => this.webSocketService.getReadReceipts()),
      map(({ chatId, userId, lastRead }) =>
        ChatActions.readReceiptUpdated({ chatId, userId, lastRead })
      )
    )
  );

  updateTypingStatus$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ChatActions.updateTypingStatus),
        tap(({ chatId, isTyping }) => {
          const userId = 'current-user'; // This should come from auth state
          this.chatService.updateTypingStatus(chatId, userId, isTyping);
        })
      ),
    { dispatch: false }
  );

  markMessagesRead$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ChatActions.markMessagesRead),
        tap(({ chatId, messageIds }) => {
          this.chatService.markAsRead(chatId, messageIds);
        })
      ),
    { dispatch: false }
  );

  // Connection Status
  listenToConnectionStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.initializeWebSocket),
      switchMap(() => this.webSocketService.getConnectionStatus()),
      map((isConnected) => ChatActions.connectionStatusUpdated({ isConnected }))
    )
  );
}
