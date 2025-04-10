import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface DialogData {
  imageUrl: string;
  title?: string;
}

@Component({
  selector: 'app-image-preview-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './image-preview-dialog.component.html',
  styleUrls: ['./image-preview-dialog.component.scss']
})
export class ImagePreviewDialogComponent {
  isZoomed = false;
  zoomLevel = 1;
  rotation = 0;

  constructor(
    public dialogRef: MatDialogRef<ImagePreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  toggleZoom(): void {
    this.isZoomed = !this.isZoomed;
    this.zoomLevel = this.isZoomed ? 2 : 1;
  }

  handleZoom(event: WheelEvent): void {
    if (this.isZoomed) {
      event.preventDefault();
      const delta = event.deltaY * -0.01;
      this.zoomLevel = Math.min(Math.max(1, this.zoomLevel + delta), 4);
    }
  }

  rotate(): void {
    this.rotation = (this.rotation + 90) % 360;
    const img = document.querySelector('.image-container img') as HTMLImageElement;
    if (img) {
      img.style.transform = `rotate(${this.rotation}deg) scale(${this.zoomLevel})`;
    }
  }

  downloadImage(): void {
    const link = document.createElement('a');
    link.href = this.data.imageUrl;
    link.download = this.data.title || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
