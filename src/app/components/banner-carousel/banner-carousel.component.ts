import { Component, computed, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BannerSlideComponent } from '../banner-slide/banner-slide.component';
import { DesktopMessageComponent } from '../desktop-message/desktop-message.component';
import { CarouselDotsComponent } from '../carousel-dots/carousel-dots.component';
import { CarouselStateComponent } from '../carousel-state/carousel-state.component';
import { CarouselGestureDirective } from '../../directives/carousel-gesture.directive';
import { BannerSlidesApiService } from '../../services/banner-slides-api.service';
import { CarouselAutoAdvanceService } from '../../services/carousel-auto-advance.service';
import { CarouselStateService } from '../../services/carousel-state.service';
import { CAROUSEL_TIMER_CONFIG } from '../../constants/carousel-timer.config';

@Component({
  selector: 'app-banner-carousel',
  providers: [CarouselStateService, CarouselAutoAdvanceService],
  imports: [
    BannerSlideComponent,
    DesktopMessageComponent,
    CarouselDotsComponent,
    CarouselStateComponent,
    CarouselGestureDirective
  ],
  templateUrl: './banner-carousel.component.html',
  styleUrl: './banner-carousel.component.scss'
})
export class BannerCarouselComponent {
  readonly swipeThreshold = input(40);
  readonly swipeIntentThreshold = input(6);
  readonly autoAdvanceEnabled = input(CAROUSEL_TIMER_CONFIG.enabled);
  readonly autoAdvanceDelayMs = input(CAROUSEL_TIMER_CONFIG.delayMs);
  readonly transitionDurationMs = input(420);

  protected readonly carousel = inject(CarouselStateService);
  private readonly autoAdvance = inject(CarouselAutoAdvanceService);
  private readonly bannerApi = inject(BannerSlidesApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isLoading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly vm = computed(() => {
    const renderSlides = this.carousel.renderSlides();
    const renderIndex = this.carousel.renderIndex();
    const dragOffset = this.carousel.dragOffset();
    const trackSlides = Math.max(renderSlides.length, 1);

    return {
      renderSlides,
      renderIndex,
      activeIndex: this.carousel.activeIndex(),
      trackWidth: `calc(100vw * ${trackSlides})`,
      transform:
        renderSlides.length === 0
          ? 'translateX(0px)'
          : `translateX(calc(-${renderIndex * 100}vw + ${dragOffset}px))`,
      isAnimatingClass: this.carousel.isAnimating() && !this.carousel.isDragging(),
      hasSlides: renderSlides.length > 0
    };
  });

  private readonly configEffect = effect(() => {
    this.autoAdvance.setConfig({
      enabled: this.autoAdvanceEnabled(),
      delayMs: this.autoAdvanceDelayMs()
    });
    this.carousel.setTransitionDuration(this.transitionDurationMs());
  });

  constructor() {
    this.loadSlides();
  }

  protected retry(): void {
    this.loadSlides();
  }

  private loadSlides(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.bannerApi
      .getSlides()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => {
          this.error.set('Failed to load banners.');
          return of(null);
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe((slides) => {
        if (!slides) {
          return;
        }
        this.carousel.setSlides(slides);
      });
  }
}
