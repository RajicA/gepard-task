import { Directive, HostListener, Input } from '@angular/core';
import { CarouselStateService } from '../services/carousel-state.service';

@Directive({
  selector: '[appCarouselGesture]',
  standalone: true
})
export class CarouselGestureDirective {
  @Input() swipeThreshold = 40;
  @Input() swipeIntentThreshold = 6;

  private startX = 0;
  private startY = 0;
  private isHorizontalSwipe = false;

  constructor(private readonly carousel: CarouselStateService) {}

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent): void {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.isHorizontalSwipe = false;
    this.carousel.beginDrag();
    if ((event.currentTarget as HTMLElement).setPointerCapture) {
      (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    }
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (!this.carousel.isDragging()) {
      return;
    }
    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;
    if (
      !this.isHorizontalSwipe &&
      (Math.abs(deltaX) > this.swipeIntentThreshold || Math.abs(deltaY) > this.swipeIntentThreshold)
    ) {
      this.isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    }
    if (this.isHorizontalSwipe && event.cancelable) {
      event.preventDefault();
      this.carousel.updateDragOffset(deltaX);
    }
  }

  @HostListener('pointerup', ['$event'])
  onPointerUp(event: PointerEvent): void {
    if (!this.carousel.isDragging()) {
      return;
    }
    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;
    let direction: 'next' | 'prev' | null = null;
    if (Math.abs(deltaX) >= Math.abs(deltaY)) {
      if (deltaX <= -this.swipeThreshold) {
        direction = 'next';
      } else if (deltaX >= this.swipeThreshold) {
        direction = 'prev';
      }
    }
    this.carousel.endDrag(direction);
    this.isHorizontalSwipe = false;
    this.releasePointer(event);
  }

  @HostListener('pointercancel', ['$event'])
  onPointerCancel(event: PointerEvent): void {
    if (!this.carousel.isDragging()) {
      return;
    }
    this.carousel.cancelDrag();
    this.isHorizontalSwipe = false;
    this.releasePointer(event);
  }

  private releasePointer(event: PointerEvent): void {
    const target = event.currentTarget as HTMLElement | null;
    if (target?.releasePointerCapture) {
      target.releasePointerCapture(event.pointerId);
    }
  }
}
