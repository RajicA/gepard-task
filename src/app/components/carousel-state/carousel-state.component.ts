import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-carousel-state',
  standalone: true,
  templateUrl: './carousel-state.component.html',
  styleUrl: './carousel-state.component.scss'
})
export class CarouselStateComponent {
  @Input() isLoading = false;
  @Input() error: string | null = null;
  @Output() retry = new EventEmitter<void>();

  protected onRetry(): void {
    this.retry.emit();
  }
}
