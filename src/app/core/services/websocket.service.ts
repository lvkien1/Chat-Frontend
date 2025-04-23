import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Message } from '../models/message.model';
import { UserStatus, UserPresence } from '../models/user.model';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private log(event: string, data?: any): void {
    const timestamp = new Date().toISOString();
    console.log(`[WS][${timestamp}] ${event}`, data || '');
  }

  private hubConnection: signalR.HubConnection | null = null;
  private isConnected$ = new BehaviorSubject<boolean>(false);
  private messageQueue: Array<{
    id: string;
    message: Message;
    timestamp: number;
    retries: number;
  }> = [];
  private maxRetries = 3;
  private maxQueueSize = 50;
  private messages$ = new Subject<Message>();
  private presenceUpdates$ = new Subject<UserPresence>();
  private typingUpdates$ = new Subject<{ chatId: string; userId: string; isTyping: boolean }>();
  private readReceipts$ = new Subject<{ chatId: string; userId: string; lastRead: Date }>();

  connect(userId: number): void {
    this.log('CONNECT_ATTEMPT', { userId });
    if (this.hubConnection) {
      this.disconnect();
    }

    // TODO: Lấy access_token động nếu cần
    const accessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJraWVuIiwiZW1haWwiOiJraWVuQGdtYWlsLmNvbSIsImp0aSI6IjdiMDA2YTExLTU5MzUtNDVkYi05YTkwLWExZGZlNWNlNWI3MyIsInVzZXJJZCI6ImU3YjhiM2FlLTUzYzAtNDBjMC04ZmVjLWE0MTUwN2NhMjUxZSIsImV4cCI6MTc0NDczMjg4OCwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwIn0.dVWeOvTKVDRUCl8MEoA2Cy6yA8FzSz0qy3lD83H1858';
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`http://localhost:5016/chatHub`, {
        accessTokenFactory: () => accessToken
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.onclose(() => {
      this.isConnected$.next(false);
      this.log('CONNECTION_CLOSED');
    });

    this.hubConnection.onreconnecting(() => {
      this.isConnected$.next(false);
      this.log('CONNECTION_RECONNECTING');
    });

    this.hubConnection.onreconnected(() => {
      this.isConnected$.next(true);
      this.log('CONNECTION_RECONNECTED');
      this.processQueue();
    });

    this.hubConnection.on('ReceiveMessage', (message: Message) => {
      this.messages$.next(message);
    });

    this.hubConnection.on('PresenceUpdate', (presence: UserPresence) => {
      this.presenceUpdates$.next(presence);
    });

    this.hubConnection.on('TypingUpdate', (typing: { chatId: string; userId: string; isTyping: boolean }) => {
      this.typingUpdates$.next(typing);
    });

    this.hubConnection.on('ReadReceipt', (receipt: { chatId: string; userId: string; lastRead: Date }) => {
      this.readReceipts$.next(receipt);
    });

    this.hubConnection
      .start()
      .then(() => {
        this.isConnected$.next(true);
        this.processQueue();
        this.log('CONNECT_SUCCESS', { userId });
      })
      .catch(error => {
        this.isConnected$.next(false);
        this.log('CONNECTION_ERROR', { error });
      });
  }

  disconnect(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
      this.hubConnection = null;
    }
    this.isConnected$.next(false);
  }

  sendMessage(message: Message): void {
    this.log('SEND_MESSAGE_ATTEMPT', { messageId: message.id });

    if (!this.isConnected$.value) {
      this.log('MESSAGE_QUEUED_OFFLINE', { messageId: message.id });
      this.addToQueue(message);
      return;
    }
    const a = {
      type: 1,
      target: 'SendMessage',
      arguments: [1, 'Xin chào từ Postman!'],
    };
    this.hubConnection
      ?.invoke('SendMessage', 1, message.content)
      .then(() => {
        debugger;
        this.messages$.next(message);
        this.log('MESSAGE_SENT_SUCCESS', { messageId: message.id });
      })
      .catch((error) => {
        this.log('MESSAGE_SEND_FAILED', { messageId: message.id, error });
        this.addToQueue(message);
      });
  }

  private addToQueue(message: Message): void {
    if (this.messageQueue.length >= this.maxQueueSize) {
      this.messageQueue.shift();
    }

    this.messageQueue.push({
      id: Math.random().toString(36).substring(2, 9),
      message,
      timestamp: Date.now(),
      retries: 0
    });
  }

  private processQueue(): void {
    if (!this.isConnected$.value || this.messageQueue.length === 0) {
      return;
    }

    const item = this.messageQueue[0];
    this.log('PROCESS_QUEUE_ITEM', {
      messageId: item.message.id,
      retryCount: item.retries
    });

    this.hubConnection?.invoke('SendMessage', item.message)
      .then(() => {
        this.messages$.next(item.message);
        this.messageQueue.shift();
        this.log('QUEUE_ITEM_SENT_SUCCESS', { messageId: item.message.id });

        if (this.messageQueue.length > 0) {
          setTimeout(() => this.processQueue(), 100);
        }
      })
      .catch(error => {
        item.retries++;
        if (item.retries >= this.maxRetries) {
          this.messageQueue.shift();
          this.log('QUEUE_ITEM_MAX_RETRIES', {
            messageId: item.message.id,
            error
          });
        }
        setTimeout(() => this.processQueue(), this.getRetryDelay(item.retries));
      });
  }

  private getRetryDelay(retryCount: number): number {
    return Math.min(5000, 1000 * Math.pow(2, retryCount));
  }

  updateStatus(status: 'online' | 'away' | 'offline'): Observable<UserStatus> {
    // Có thể mở rộng: gửi status lên server qua SignalR nếu backend hỗ trợ
    const response: UserStatus = {
      userId: 'current-user',
      status,
      lastSeen: new Date()
    };
    return new Observable(subscriber => {
      setTimeout(() => {
        subscriber.next(response);
        subscriber.complete();
      }, 100);
    });
  }

  updateTypingStatus(chatId: string, isTyping: boolean): void {
    // Gửi trạng thái typing lên server nếu backend hỗ trợ
    this.hubConnection?.invoke('UpdateTyping', { chatId, isTyping })
      .catch(() => {
        // fallback local
        this.typingUpdates$.next({
          chatId,
          userId: 'current-user',
          isTyping
        });
      });
  }

  markMessagesRead(chatId: string, messageIds: string[]): void {
    // Gửi read receipt lên server nếu backend hỗ trợ
    this.hubConnection?.invoke('MarkMessagesRead', { chatId, messageIds })
      .catch(() => {
        this.readReceipts$.next({
          chatId,
          userId: 'current-user',
          lastRead: new Date()
        });
      });
  }

  // Getters for observables
  getMessages(): Observable<Message> {
    return this.messages$.asObservable();
  }

  getPresenceUpdates(): Observable<UserPresence> {
    return this.presenceUpdates$.asObservable();
  }

  getTypingUpdates(): Observable<{ chatId: string; userId: string; isTyping: boolean }> {
    return this.typingUpdates$.asObservable();
  }

  getReadReceipts(): Observable<{ chatId: string; userId: string; lastRead: Date }> {
    return this.readReceipts$.asObservable();
  }

  getConnectionStatus(): Observable<boolean> {
    return this.isConnected$.asObservable();
  }

  connectConversation(): void {
    this.hubConnection
      ?.invoke('JoinConversation', 1)
      .then(() => console.log('Joined conversation:', 1))
      .catch((err) => console.error('JoinConversation error:', err));
  }
}
