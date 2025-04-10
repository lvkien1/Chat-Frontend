import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Message, MessageAttachment, FileMessage, isFileMessage, getFileIcon } from '../../../../core/models/message.model';
import * as ChatSelectors from '../../../../store/chat/chat.selectors';

interface FileEntry {
  chatId: string;
  messageId: string;
  file: MessageAttachment;
  timestamp: Date;
  senderId: string;
}

@Component({
  selector: 'app-files-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.scss']
})
export class FilesListComponent implements OnInit {
  files$: Observable<FileEntry[]>;

  constructor(private store: Store) {
    // Get all messages and filter file messages
    this.files$ = this.store.select(ChatSelectors.selectAllFileMessages).pipe(
      map((messages: Message[]) => 
        messages.flatMap(message => {
          if (!message.attachments) return [];
          return message.attachments.map(attachment => ({
            chatId: message.chatId,
            messageId: message.id,
            file: attachment,
            timestamp: message.timestamp,
            senderId: message.senderId
          }));
        }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      )
    );
  }

  ngOnInit(): void {
    // No initialization needed as messages are loaded by chat feature
  }

  getFileIcon(mimeType: string): string {
    return getFileIcon(mimeType);
  }

  openFile(entry: FileEntry): void {
    window.open(entry.file.url, '_blank');
  }
}
