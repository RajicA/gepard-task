import { computed, DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { timer } from 'rxjs';
import { CAROUSEL_TIMER_CONFIG } from '../constants/carousel-timer.config';
import { CarouselStateService } from './carousel-state.service';

@Injectable()
export class CarouselAutoAdvanceService {
  private readonly enabledSignal = signal(CAROUSEL_TIMER_CONFIG.enabled);
  private readonly delayMsSignal = signal(CAROUSEL_TIMER_CONFIG.delayMs);
  private readonly destroyRef = inject(DestroyRef);

  private readonly canAutoAdvanceSignal = computed(() => {
    return (
      this.enabledSignal() &&
      this.carousel.slidesCount() > 1 &&
      !this.carousel.isDragging() &&
      !this.carousel.isTransitioning() &&
      !this.carousel.isJumping()
    );
  });

  constructor(private readonly carousel: CarouselStateService) {
    this.destroyRef.onDestroy(() => this.cleanup());

    effect((onCleanup) => {
      if (!this.canAutoAdvanceSignal()) {
        return;
      }
      const delayMs = this.delayMsSignal();
      const sub = timer(delayMs).subscribe(() => {
        if (!this.canAutoAdvanceSignal()) {
          return;
        }
        this.carousel.next();
      });
      onCleanup(() => sub.unsubscribe());
    });
  }

  setConfig(config: { enabled?: boolean; delayMs?: number }): void {
    if (typeof config.enabled === 'boolean') {
      this.enabledSignal.set(config.enabled);
    }
    if (typeof config.delayMs === 'number' && config.delayMs > 0) {
      this.delayMsSignal.set(config.delayMs);
    }
  }

  private cleanup(): void {
    // interval subscriptions are cleaned up via effect onCleanup
  }
}
