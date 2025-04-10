import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Message } from '../models/message.model';
import { UserStatus, UserPresence } from '../models/user.model';

type WebSocketEvent = {
  type: string;
  payload: any;
};

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private log(event: string, data?: any): void {
    const timestamp = new Date().toISOString();
    console.log(`[WS][${timestamp}] ${event}`, data || '');
  }

  private socket: WebSocket | null = null;
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

  connect(userId: string): void {
    this.log('CONNECT_ATTEMPT', { userId });
    if (this.socket) {
      this.disconnect();
    }

    this.socket = new WebSocket(`wss://your-api-endpoint/ws?userId=${userId}`);
    
    this.socket.onopen = () => {
      this.isConnected$.next(true);
      this.processQueue();
      this.log('CONNECT_SUCCESS', { userId });
    };

    this.socket.onclose = () => {
      this.isConnected$.next(false);
      this.log('CONNECTION_CLOSED');
    };

    this.socket.onerror = (error) => {
      this.log('CONNECTION_ERROR', { error });
    };

    this.socket.onmessage = (event) => {
      this.handleMessage(event);
    };
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
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

    try {
      this.socket?.send(JSON.stringify({
        type: 'MESSAGE',
        payload: message
      }));
      this.messages$.next(message);
      this.log('MESSAGE_SENT_SUCCESS', { messageId: message.id });
    } catch (error) {
      this.log('MESSAGE_SEND_FAILED', { messageId: message.id, error });
      this.addToQueue(message);
    }
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

    try {
      this.socket?.send(JSON.stringify({
        type: 'MESSAGE',
        payload: item.message
      }));
      this.messages$.next(item.message);
      this.messageQueue.shift();
      this.log('QUEUE_ITEM_SENT_SUCCESS', { messageId: item.message.id });
      
      if (this.messageQueue.length > 0) {
        setTimeout(() => this.processQueue(), 100);
      }
    } catch (error) {
      item.retries++;
      if (item.retries >= this.maxRetries) {
        this.messageQueue.shift();
        this.log('QUEUE_ITEM_MAX_RETRIES', { 
          messageId: item.message.id,
          error 
        });
      }
      setTimeout(() => this.processQueue(), this.getRetryDelay(item.retries));
    }
  }

  private getRetryDelay(retryCount: number): number {
    return Math.min(5000, 1000 * Math.pow(2, retryCount));
  }

  updateStatus(status: 'online' | 'away' | 'offline'): Observable<UserStatus> {
    // Mock implementation
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
    // Mock implementation
    this.typingUpdates$.next({
      chatId,
      userId: 'current-user',
      isTyping
    });
  }

  markMessagesRead(chatId: string, messageIds: string[]): void {
    // Mock implementation
    this.readReceipts$.next({
      chatId,
      userId: 'current-user',
      lastRead: new Date()
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

  private handleMessage(event: MessageEvent): void {
    try {
      const data: WebSocketEvent = JSON.parse(event.data);
      
      switch (data.type) {
        case 'MESSAGE':
          this.messages$.next(data.payload);
          break;
        case 'PRESENCE':
          this.presenceUpdates$.next(data.payload);
          break;
        case 'TYPING':
          this.typingUpdates$.next(data.payload);
          break;
        case 'READ_RECEIPT':
          this.readReceipts$.next(data.payload);
          break;
        default:
          console.warn('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  }
}
