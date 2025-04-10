import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message, MessageAttachment, getFileIcon } from '../../../core/models/message.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectCurrentTheme } from '../../../store/user/user.selectors';

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-bubble.component.html',
  styleUrls: ['./message-bubble.component.scss'],
})
export class MessageBubbleComponent implements OnInit {
  @Input() message!: Message;
  @Input() isOwnMessage: boolean = false;

  @Output() fileClick = new EventEmitter<MessageAttachment>();
  @Output() imageClick = new EventEmitter<MessageAttachment>();

  currentTheme$: Observable<'light' | 'dark'>;

  constructor(private store: Store) {
    this.currentTheme$ = this.store.select(selectCurrentTheme);
  }

  ngOnInit(): void {
    // Initialization logic if needed
  }

  getFileIcon(mimeType: string): string {
    return getFileIcon(mimeType);
  }

  getMessageStatusIcon(): string {
    return 'check'; // Simplified for now
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onFileClick(attachment: MessageAttachment): void {
    this.fileClick.emit(attachment);
  }

  onImageClick(attachment: MessageAttachment): void {
    this.imageClick.emit(attachment);
  }
}
