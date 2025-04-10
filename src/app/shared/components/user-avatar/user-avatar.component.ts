import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../core/models/user.model';
import { ChatUtil } from '../../../utils/ChatUtil';
@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
})
export class UserAvatarComponent {
  @Input() user: User | null = null;
  @Input() size = 50;
  @Input() showStatus = true;

  ChatUtil = ChatUtil;
}
